import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CATEGORIES = [
  "Health", "Weather", "Sports", "Food", "Film", "Music",
  "Culture", "Fashion", "Space", "Pets", "Travel", "Cars",
  "Politics", "Science", "Money", "Education",
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PERPLEXITY_API_KEY = Deno.env.get("PERPLEXITY_API_KEY");
    if (!PERPLEXITY_API_KEY) throw new Error("PERPLEXITY_API_KEY not configured");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase config missing");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get today's date in Amman timezone (UTC+3)
    const ammanDate = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });

    // Check if we already have ideas for today
    const { data: existing } = await supabase
      .from("daily_ideas")
      .select("id")
      .eq("date", ammanDate)
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ message: "Ideas already generated for today", date: ammanDate }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating ideas for ${ammanDate}...`);

    // Step 1: Use Perplexity to find today's news for each category
    const newsResults: Record<string, { headline: string; url: string }[]> = {};

    for (const category of CATEGORIES) {
      console.log(`Searching news for: ${category}`);
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
                content: "You are a news researcher. Return ONLY a JSON array of objects with 'headline' and 'url' fields. No other text. URLs must be real, direct article links (not homepages).",
              },
              {
                role: "user",
                content: `Find 3 important news stories from today or the last 24 hours in the "${category}" category. Return as JSON array: [{"headline": "...", "url": "https://..."}]`,
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

        // Parse JSON from response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          newsResults[category] = parsed.slice(0, 3);
        }
      } catch (e) {
        console.error(`Error fetching news for ${category}:`, e);
      }

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));
    }

    // Step 2: Use Lovable AI to generate business ideas from the news
    const allIdeas: Array<{
      date: string;
      tag: string;
      title: string;
      description: string;
      source_event: string;
      source_url: string;
      is_featured: boolean;
    }> = [];

    for (const category of CATEGORIES) {
      const news = newsResults[category];
      if (!news || news.length === 0) {
        console.log(`No news found for ${category}, skipping`);
        continue;
      }

      const newsPrompt = news
        .map((n, i) => `${i + 1}. "${n.headline}" - ${n.url}`)
        .join("\n");

      try {
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
                content: `You are a startup idea generator. Given news stories, create unique, actionable startup business ideas. Return ONLY a valid JSON array.`,
              },
              {
                role: "user",
                content: `Given these ${category} news stories from today:\n${newsPrompt}\n\nGenerate one startup idea for EACH story. Return a JSON array of objects:\n[{"title": "Startup Name", "description": "2-3 sentence business concept", "source_event": "the news headline", "source_url": "the article URL", "is_featured": false}]\n\nMark the first idea as is_featured: true. Keep descriptions punchy and entrepreneurial.`,
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

        const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const ideas = JSON.parse(jsonMatch[0]);
          for (const idea of ideas) {
            allIdeas.push({
              date: ammanDate,
              tag: category,
              title: idea.title,
              description: idea.description,
              source_event: idea.source_event || idea.sourceEvent,
              source_url: idea.source_url || idea.sourceUrl,
              is_featured: idea.is_featured || false,
            });
          }
        }
      } catch (e) {
        console.error(`Error generating ideas for ${category}:`, e);
      }

      await new Promise((r) => setTimeout(r, 300));
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
        categories: Object.keys(newsResults).length,
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
