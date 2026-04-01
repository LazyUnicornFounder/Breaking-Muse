import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CATEGORIES = [
  "Architecture", "Art", "Boxing", "Cars", "Coffee", "Construction",
  "Creator", "Crypto", "Culture", "Design", "Education", "Fashion", "Film",
  "Food", "Gaming", "Health", "Humanitarian", "Law", "Living", "Money",
  "Music", "Outdoors", "Parenting", "Pets", "Politics", "Real Estate",
  "Science", "Space", "Sports", "Tech", "Travel", "VC", "Weather",
];

const BATCH_SIZE = 3;
const IDEAS_PER_CATEGORY = 10;
const MAX_RETRIES = 3;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing config");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const ammanDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });

    let totalCount = 0;
    const errors: string[] = [];

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      // Check which categories still need ideas
      const { data: existingIdeas } = await supabase
        .from("daily_ideas")
        .select("tag")
        .eq("date", ammanDate);

      const counts: Record<string, number> = {};
      for (const row of existingIdeas || []) {
        counts[row.tag] = (counts[row.tag] || 0) + 1;
      }

      const underfilled = CATEGORIES.filter(
        (cat) => (counts[cat] || 0) < IDEAS_PER_CATEGORY
      );

      if (underfilled.length === 0) {
        console.log(`All categories have ${IDEAS_PER_CATEGORY} ideas. Done.`);
        break;
      }

      console.log(
        `Attempt ${attempt}/${MAX_RETRIES}: ${underfilled.length} categories need ideas: ${underfilled.join(", ")}`
      );

      // Process underfilled categories in batches
      const batches: string[][] = [];
      for (let i = 0; i < underfilled.length; i += BATCH_SIZE) {
        batches.push(underfilled.slice(i, i + BATCH_SIZE));
      }

      for (const batch of batches) {
        try {
          console.log(`Processing batch: ${batch.join(", ")}`);
          const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-ideas`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ categories: batch }),
          });

          if (!res.ok) {
            const text = await res.text();
            errors.push(`[Attempt ${attempt}] Batch [${batch.join(",")}] failed: ${res.status} ${text}`);
            console.error(`Batch failed:`, text);
            continue;
          }

          const data = await res.json();
          totalCount += data.count || 0;
          console.log(`Batch [${batch.join(",")}] done: ${data.count} ideas`);
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          errors.push(`[Attempt ${attempt}] Batch [${batch.join(",")}] error: ${msg}`);
          console.error(`Batch error:`, msg);
        }

        await new Promise((r) => setTimeout(r, 1000));
      }

      // Brief pause before checking again
      await new Promise((r) => setTimeout(r, 2000));
    }

    // Final check
    const { data: finalIdeas } = await supabase
      .from("daily_ideas")
      .select("tag")
      .eq("date", ammanDate);

    const finalCounts: Record<string, number> = {};
    for (const row of finalIdeas || []) {
      finalCounts[row.tag] = (finalCounts[row.tag] || 0) + 1;
    }
    const stillMissing = CATEGORIES.filter(
      (cat) => (finalCounts[cat] || 0) < IDEAS_PER_CATEGORY
    );

    return new Response(
      JSON.stringify({
        success: true,
        totalCount,
        errors,
        stillMissing: stillMissing.map((cat) => ({
          category: cat,
          count: finalCounts[cat] || 0,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("batch dispatcher error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
