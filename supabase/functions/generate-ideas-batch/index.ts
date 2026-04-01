import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

const CATEGORIES = [
  "Architecture", "Art", "Boxing", "Cars", "Coffee", "Construction",
  "Creator", "Crypto", "Culture", "Design", "Education", "Fashion", "Film",
  "Food", "Gaming", "Health", "Humanitarian", "Law", "Living", "Money",
  "Music", "Outdoors", "Parenting", "Pets", "Politics", "Real Estate",
  "Science", "Space", "Sports", "Tech", "Travel", "VC", "Weather",
];

const BATCH_SIZE = 3;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("Missing config");

    const batches: string[][] = [];
    for (let i = 0; i < CATEGORIES.length; i += BATCH_SIZE) {
      batches.push(CATEGORIES.slice(i, i + BATCH_SIZE));
    }

    let totalCount = 0;
    const errors: string[] = [];

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
          errors.push(`Batch [${batch.join(",")}] failed: ${res.status} ${text}`);
          console.error(`Batch failed:`, text);
          continue;
        }

        const data = await res.json();
        totalCount += data.count || 0;
        console.log(`Batch [${batch.join(",")}] done: ${data.count} ideas`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(`Batch [${batch.join(",")}] error: ${msg}`);
        console.error(`Batch error:`, msg);
      }

      // Small delay between batches
      await new Promise((r) => setTimeout(r, 1000));
    }

    return new Response(
      JSON.stringify({ success: true, totalCount, errors }),
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
