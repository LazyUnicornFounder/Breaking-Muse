import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ALL_CATEGORIES = [
  "Health", "Weather", "Sports", "Food", "Film", "Music",
  "Culture", "Fashion", "Space", "Pets", "Travel", "Cars",
  "Politics", "Science", "Money", "Education", "Gaming", "Creator",
];

const BATCH_SIZE = 3;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");

    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: "Invalid password" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const ammanDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });

    // Delete today's ideas
    const { error: deleteError } = await supabase
      .from("daily_ideas")
      .delete()
      .eq("date", ammanDate);

    if (deleteError) {
      throw new Error(`Delete failed: ${deleteError.message}`);
    }

    console.log(`Deleted ideas for ${ammanDate}, now triggering batch regeneration...`);

    // Fire off generate-ideas in small category batches (fire-and-forget to avoid timeout)
    let totalCount = 0;
    const batches: string[][] = [];
    for (let i = 0; i < ALL_CATEGORIES.length; i += BATCH_SIZE) {
      batches.push(ALL_CATEGORIES.slice(i, i + BATCH_SIZE));
    }

    // Process batches sequentially but each batch is small enough to complete in time
    for (const batch of batches) {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-ideas`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categories: batch }),
        });

        if (res.ok) {
          const data = await res.json();
          totalCount += data.count || 0;
          console.log(`Batch [${batch.join(", ")}]: generated ${data.count || 0} ideas`);
        } else {
          const text = await res.text();
          console.error(`Batch [${batch.join(", ")}] failed: ${res.status} - ${text}`);
        }
      } catch (e) {
        console.error(`Batch [${batch.join(", ")}] error:`, e);
      }
    }

    console.log(`Total regenerated: ${totalCount} ideas for ${ammanDate}`);

    return new Response(
      JSON.stringify({ success: true, date: ammanDate, generation: { count: totalCount } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("admin-regenerate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
