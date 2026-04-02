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

const IDEAS_PER_CATEGORY = 10;
const MAX_ROUNDS = 5;

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

    let totalGenerated = 0;
    const errors: string[] = [];

    for (let round = 1; round <= MAX_ROUNDS; round++) {
      // Check which categories are underfilled
      const { data: existing } = await supabase
        .from("daily_ideas")
        .select("tag")
        .eq("date", ammanDate);

      const counts: Record<string, number> = {};
      for (const row of existing || []) {
        counts[row.tag] = (counts[row.tag] || 0) + 1;
      }

      const underfilled = CATEGORIES.filter(
        (cat) => (counts[cat] || 0) < IDEAS_PER_CATEGORY
      );

      if (underfilled.length === 0) {
        console.log(`Round ${round}: All categories full. Done.`);
        break;
      }

      console.log(`Round ${round}/${MAX_ROUNDS}: ${underfilled.length} underfilled: ${underfilled.join(", ")}`);

      // Process one category at a time to avoid timeouts
      for (const category of underfilled) {
        try {
          console.log(`Generating for: ${category} (has ${counts[category] || 0}/${IDEAS_PER_CATEGORY})`);
          const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-ideas`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ categories: [category] }),
          });

          if (!res.ok) {
            const text = await res.text();
            errors.push(`[Round ${round}] ${category}: ${res.status} ${text}`);
            console.error(`Failed ${category}:`, text);
          } else {
            const data = await res.json();
            totalGenerated += data.count || 0;
            console.log(`${category}: +${data.count || 0} ideas`);
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          errors.push(`[Round ${round}] ${category}: ${msg}`);
          console.error(`Error ${category}:`, msg);
        }

        // Brief pause between categories
        await new Promise((r) => setTimeout(r, 1000));
      }

      // Pause before next round
      await new Promise((r) => setTimeout(r, 2000));
    }

    // Final status
    const { data: finalCheck } = await supabase
      .from("daily_ideas")
      .select("tag")
      .eq("date", ammanDate);

    const finalCounts: Record<string, number> = {};
    for (const row of finalCheck || []) {
      finalCounts[row.tag] = (finalCounts[row.tag] || 0) + 1;
    }
    const stillMissing = CATEGORIES.filter(
      (cat) => (finalCounts[cat] || 0) < IDEAS_PER_CATEGORY
    );

    return new Response(
      JSON.stringify({
        success: true,
        date: ammanDate,
        totalGenerated,
        errors,
        stillMissing: stillMissing.map((cat) => ({
          category: cat,
          count: finalCounts[cat] || 0,
        })),
        allFull: stillMissing.length === 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("retry-underfilled error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
