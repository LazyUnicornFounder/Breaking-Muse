import { supabase } from "@/integrations/supabase/client";

export interface RedditIdeaEntry {
  title: string;
  description: string;
  sourceEvent: string;
  sourceUrl: string;
  tag: string;
  isFeatured: boolean;
}

function getAmmanDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });
}

export async function fetchRedditIdeasForDate(date?: string): Promise<{
  featured: RedditIdeaEntry[];
  all: Record<string, RedditIdeaEntry[]>;
}> {
  const targetDate = date || getAmmanDate();
  const result = await _fetchInternal(targetDate);

  if (result.featured.length === 0 && Object.keys(result.all).length === 0 && targetDate === getAmmanDate()) {
    const yesterday = new Date(targetDate + "T12:00:00");
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    return _fetchInternal(yesterdayStr);
  }

  return result;
}

async function _fetchInternal(targetDate: string): Promise<{
  featured: RedditIdeaEntry[];
  all: Record<string, RedditIdeaEntry[]>;
}> {
  const { data, error } = await supabase
    .from("reddit_ideas" as any)
    .select("*")
    .eq("date", targetDate)
    .order("is_featured", { ascending: false })
    .order("tag");

  if (error) {
    console.error("Error fetching reddit ideas:", error);
    return { featured: [], all: {} };
  }

  const featured: RedditIdeaEntry[] = [];
  const all: Record<string, RedditIdeaEntry[]> = {};
  const featuredTags = new Set<string>();

  for (const row of (data as any[]) || []) {
    const entry: RedditIdeaEntry = {
      title: row.title,
      description: row.description,
      sourceEvent: row.source_event,
      sourceUrl: row.source_url,
      tag: row.tag,
      isFeatured: row.is_featured,
    };

    if (row.is_featured && !featuredTags.has(row.tag)) {
      featured.push(entry);
      featuredTags.add(row.tag);
    }

    if (!all[row.tag]) all[row.tag] = [];
    all[row.tag].push(entry);
  }

  return { featured, all };
}
