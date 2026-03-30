import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CATEGORIES = [
  "Health", "Weather", "Sports", "Food", "Film", "Music",
  "Culture", "Fashion", "Space", "Pets", "Travel", "Cars",
  "Politics", "Science", "Money", "Education", "Gaming", "Creator",
];

const IDEAS_PER_CATEGORY = 10;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Accept optional category subset to avoid timeouts
    let requestedCategories: string[] | null = null;
    try {
      const body = await req.json();
      if (body.categories && Array.isArray(body.categories)) {
        requestedCategories = body.categories;
      }
    } catch { /* no body or invalid JSON, use all categories */ }
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) throw new Error("PERPLEXITY_API_KEY not configured");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase config missing");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const ammanDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });

    // Check existing idea counts per category for today
    const { data: existingIdeas } = await supabase
      .from("daily_ideas")
      .select("tag, id")
      .eq("date", ammanDate);

    const existingCounts: Record<string, number> = {};
    for (const row of existingIdeas || []) {
      existingCounts[row.tag] = (existingCounts[row.tag] || 0) + 1;
    }

    // Find categories that need more ideas
    const pool = requestedCategories || CATEGORIES;
    const categoriesToFill = pool.filter(
      (cat) => (existingCounts[cat] || 0) < IDEAS_PER_CATEGORY
    );

    if (categoriesToFill.length === 0) {
      return new Response(
        JSON.stringify({ message: "All categories have 10 ideas for today", date: ammanDate }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating ideas for ${ammanDate}, categories needing ideas: ${categoriesToFill.join(", ")}`);

    const allIdeas: Array<{
      date: string;
      tag: string;
      title: string;
      description: string;
      source_event: string;
      source_url: string;
      is_featured: boolean;
    }> = [];

    for (const category of categoriesToFill) {
      const needed = IDEAS_PER_CATEGORY - (existingCounts[category] || 0);
      const hasFeatured = (existingIdeas || []).some(
        (r) => r.tag === category
      );

      console.log(`${category}: need ${needed} more ideas`);

      // Step 1: Fetch news via Perplexity
      try {
        const perplexityRes = await fetch("https://api.perplexity.ai/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              {
                role: "system",
                content: "You are a news researcher. Return ONLY a JSON array of objects with a 'headline' field. No other text.",
              },
              {
                role: "user",
                content: `Find ${needed} important and diverse news stories from today or the last 24 hours in the "${category}" category. Return as JSON array: [{"headline": "..."}]`,
              },
            ],
            search_recency_filter: "day",
          }),
        });

        if (!perplexityRes.ok) {
          console.error(`Perplexity error for ${category}: ${perplexityRes.status}`);
          continue;
        }

        const perplexityData = await perplexityRes.json();
        const content = perplexityData.choices?.[0]?.message?.content || "";
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) continue;

        const parsed = JSON.parse(jsonMatch[0]);
        const newsItems = parsed
          .map((item: { headline: string }) => ({
            headline: item.headline,
            url: `https://news.google.com/search?q=${encodeURIComponent(item.headline)}`,
          }))
          .slice(0, needed);

        // Step 2: Generate ideas from news
        const newsPrompt = newsItems
          .map((n: { headline: string; url: string }, i: number) => `${i + 1}. "${n.headline}" - ${n.url}`)
          .join("\n");

        const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content: "You are a startup idea namer and describer. Given news stories, invent a unique startup idea for each one. Return ONLY a valid JSON array.",
              },
              {
                role: "user",
                content: `Given these ${category} news stories from today:\n${newsPrompt}\n\nFor EACH story, generate one startup idea. Rules:\n- \"title\": A short, catchy startup name, 2-4 words max (e.g. \"PermitPilot\", \"TrustLoop\", \"NestPulse\")\n- \"description\": 1-2 plain sentences. Explain it like you would to a friend — no jargon, no buzzwords.\n- \"source_event\": the news headline\n- \"source_url\": the article URL\n- \"is_featured\": false\n\nReturn a JSON array: [{"title": "...", "description": "...", "source_event": "...", "source_url": "...", "is_featured": false}]`,
              },
            ],
          }),
        });

        if (!aiRes.ok) {
          console.error(`AI error for ${category}: ${aiRes.status}`);
          continue;
        }

        const aiData = await aiRes.json();
        const aiContent = aiData.choices?.[0]?.message?.content || "";
        const aiMatch = aiContent.match(/\[[\s\S]*\]/);
        if (!aiMatch) continue;

        const ideas = JSON.parse(aiMatch[0]);
        let featuredSet = hasFeatured;

        for (const idea of ideas.slice(0, needed)) {
          allIdeas.push({
            date: ammanDate,
            tag: category,
            title: idea.title,
            description: idea.description,
            source_event: idea.source_event || idea.sourceEvent,
            source_url: idea.source_url || idea.sourceUrl,
            is_featured: !featuredSet ? (featuredSet = true, true) : false,
          });
        }
      } catch (e) {
        console.error(`Error for ${category}:`, e);
      }

      await new Promise((r) => setTimeout(r, 500));
    }

    // Step 3: Insert into database
    if (allIdeas.length > 0) {
      const { error } = await supabase.from("daily_ideas").upsert(allIdeas, {
        onConflict: "date,tag,title",
      });

      if (error) {
        console.error("Insert error:", error);
        throw new Error(`Database insert failed: ${error.message}`);
      }
    }

    console.log(`Generated ${allIdeas.length} ideas for ${ammanDate}`);

    return new Response(
      JSON.stringify({
        success: true,
        date: ammanDate,
        count: allIdeas.length,
        categoriesFilled: categoriesToFill.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-ideas error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
