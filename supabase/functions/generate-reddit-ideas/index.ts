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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const { data: existingIdeas } = await supabase
      .from("reddit_ideas")
      .select("tag, id")
      .eq("date", ammanDate);

    const existingCounts: Record<string, number> = {};
    for (const row of existingIdeas || []) {
      existingCounts[row.tag] = (existingCounts[row.tag] || 0) + 1;
    }

    const pool = requestedCategories || CATEGORIES;
    const categoriesToFill = pool.filter(
      (cat) => (existingCounts[cat] || 0) < IDEAS_PER_CATEGORY
    );

    if (categoriesToFill.length === 0) {
      return new Response(
        JSON.stringify({ message: "All categories have 10 reddit ideas for today", date: ammanDate }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Generating reddit ideas for ${ammanDate}, categories needing ideas: ${categoriesToFill.join(", ")}`);

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

      console.log(`${category}: need ${needed} more reddit ideas`);

      try {
        // Step 1: Fetch Reddit complaints via Perplexity
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
                content: "You are a Reddit researcher. Return ONLY a JSON array of objects with a 'complaint' field. No other text.",
              },
              {
                role: "user",
                content: `Find ${needed} real complaints or problems people are posting about on Reddit in the "${category}" category in the last 24 hours. Focus on pain points, frustrations, and unmet needs. Return as JSON array: [{"complaint": "..."}]`,
              },
            ],
            search_recency_filter: "day",
          }),
        });

        if (!perplexityRes.ok) {
          console.error(`Perplexity error for ${category}: ${perplexityRes.status}`);
          await supabase.from("reddit_ideas_errors").insert({ category, error: `Perplexity HTTP ${perplexityRes.status}` });
          continue;
        }

        const perplexityData = await perplexityRes.json();
        const content = perplexityData.choices?.[0]?.message?.content || "";
        console.log(`Perplexity raw for ${category}:`, content.substring(0, 200));
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          console.error(`No JSON array found for ${category}`);
          await supabase.from("reddit_ideas_errors").insert({ category, error: "No JSON array in Perplexity response" });
          continue;
        }

        const cleanedJson = jsonMatch[0]
          .replace(/,\s*\]/g, ']')
          .replace(/,\s*\}/g, '}')
          .replace(/[\x00-\x1f]/g, ' ');
        const parsed = JSON.parse(cleanedJson);
        const complaintItems = parsed
          .filter((item: { complaint: string }) => item.complaint && !item.complaint.toLowerCase().includes('youtube'))
          .map((item: { complaint: string }) => {
            const complaint = item.complaint.replace(/\[\d+\]/g, '').trim();
            return {
              complaint,
              url: `https://www.reddit.com/search/?q=${encodeURIComponent(complaint)}&sort=new`,
            };
          })
          .slice(0, needed);

        // Step 2: Generate ideas from complaints
        const complaintsPrompt = complaintItems
          .map((n: { complaint: string; url: string }, i: number) => `${i + 1}. "${n.complaint}"`)
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
                content: "You are a startup idea generator. Given Reddit complaints, invent one startup idea per complaint that directly solves that problem. Return ONLY a valid JSON array.",
              },
              {
                role: "user",
                content: `Given these ${category} Reddit complaints:\n${complaintsPrompt}\n\nFor EACH complaint, generate one startup idea. Rules:\n- "title": 2-4 words, descriptive and self-explanatory (e.g. "RentTracker", "ClinicQueue"). No abstract wordplay.\n- "description": one sentence, 10 words max, plain english. Never start with "We", "This app", "Our", or "This platform".\n- "source_event": the Reddit complaint (copy it exactly)\n- "is_featured": false\n- Do NOT include source_url in your response\n- Every idea must use a different complaint. No duplicate titles.\n\nReturn a JSON array: [{"title": "...", "description": "...", "source_event": "...", "is_featured": false}]`,
              },
            ],
          }),
        });

        if (!aiRes.ok) {
          console.error(`AI error for ${category}: ${aiRes.status}`);
          await supabase.from("reddit_ideas_errors").insert({ category, error: `AI HTTP ${aiRes.status}` });
          continue;
        }

        const aiData = await aiRes.json();
        const aiContent = aiData.choices?.[0]?.message?.content || "";
        const aiMatch = aiContent.match(/\[[\s\S]*\]/);
        if (!aiMatch) {
          await supabase.from("reddit_ideas_errors").insert({ category, error: "No JSON array in AI response" });
          continue;
        }

        const ideas = JSON.parse(aiMatch[0]);
        let featuredSet = hasFeatured;

        const usedTitles = new Set(allIdeas.map(i => i.title.toLowerCase()));
        const usedSources = new Set(allIdeas.map(i => i.source_event.toLowerCase()));
        for (const row of existingIdeas || []) {
          usedTitles.add((row as any).title?.toLowerCase?.() || "");
          usedSources.add((row as any).source_event?.toLowerCase?.() || "");
        }

        let added = 0;
        for (let i = 0; i < ideas.length; i++) {
          if (added >= needed) break;
          const idea = ideas[i];
          const complaintItem = complaintItems[i] || complaintItems[complaintItems.length - 1];
          const title = (idea.title || "").trim();
          const source = (idea.source_event || idea.sourceEvent || "").trim();
          if (usedTitles.has(title.toLowerCase()) || usedSources.has(source.toLowerCase())) continue;
          usedTitles.add(title.toLowerCase());
          usedSources.add(source.toLowerCase());
          allIdeas.push({
            date: ammanDate,
            tag: category,
            title,
            description: idea.description,
            source_event: source,
            source_url: complaintItem.url,
            is_featured: !featuredSet ? (featuredSet = true, true) : false,
          });
          added++;
        }
      } catch (e) {
        console.error(`Error for ${category}:`, e);
        await supabase.from("reddit_ideas_errors").insert({ category, error: e instanceof Error ? e.message : String(e) });
      }

      await new Promise((r) => setTimeout(r, 500));
    }

    // Step 3: Insert into database
    if (allIdeas.length > 0) {
      const { error } = await supabase.from("reddit_ideas").upsert(allIdeas, {
        onConflict: "date,tag,title",
      });

      if (error) {
        console.error("Insert error:", error);
        throw new Error(`Database insert failed: ${error.message}`);
      }
    }

    console.log(`Generated ${allIdeas.length} reddit ideas for ${ammanDate}`);

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
    console.error("generate-reddit-ideas error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
