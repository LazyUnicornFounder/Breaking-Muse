import { supabase } from "@/integrations/supabase/client";

export interface IdeaEntry {
  title: string;
  description: string;
  sourceEvent: string;
  sourceUrl: string;
  tag: string;
  isFeatured: boolean;
}

export interface DayIdeas {
  date: string;
  ideas: IdeaEntry[];
}

/**
 * Get the current date in Amman timezone (UTC+3).
 */
function getAmmanDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });
}

/**
 * Fetch ideas for a specific date.
 * Returns featured ideas and all ideas grouped by category.
 */
export async function fetchIdeasForDate(date?: string): Promise<{
  featured: IdeaEntry[];
  all: Record<string, IdeaEntry[]>;
}> {
  const targetDate = date || getAmmanDate();

  const result = await _fetchIdeasForDateInternal(targetDate);

  // If no ideas found for today's date, retry with yesterday's date
  if (result.featured.length === 0 && Object.keys(result.all).length === 0 && targetDate === getAmmanDate()) {
    const yesterday = new Date(targetDate + "T12:00:00");
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    return _fetchIdeasForDateInternal(yesterdayStr);
  }

  return result;
}

async function _fetchIdeasForDateInternal(targetDate: string): Promise<{
  featured: IdeaEntry[];
  all: Record<string, IdeaEntry[]>;
}> {
  const { data, error } = await supabase
    .from("daily_ideas")
    .select("*")
    .eq("date", targetDate)
    .order("is_featured", { ascending: false })
    .order("tag");

  if (error) {
    console.error("Error fetching ideas:", error);
    return { featured: [], all: {} };
  }

  const featured: IdeaEntry[] = [];
  const all: Record<string, IdeaEntry[]> = {};

  const featuredTags = new Set<string>();

  for (const row of data || []) {
    const entry: IdeaEntry = {
      title: row.title,
      description: row.description,
      sourceEvent: row.source_event,
      sourceUrl: row.source_url,
      tag: row.tag,
      isFeatured: row.is_featured,
    };

    // Only pick one featured idea per category
    if (row.is_featured && !featuredTags.has(row.tag)) {
      featured.push(entry);
      featuredTags.add(row.tag);
    }

    if (!all[row.tag]) all[row.tag] = [];
    all[row.tag].push(entry);
  }

  return { featured, all };
}

/** @deprecated Use fetchIdeasForDate instead */
export const fetchTodayIdeas = () => fetchIdeasForDate();

const CATEGORY_ORDER = [
  "Art", "Boxing", "Cars", "Coffee", "Construction", "Creator", "Culture",
  "Design", "Education", "Fashion", "Film", "Food", "Gaming", "Health",
  "Humanitarian", "Law", "Living", "Money", "Music", "Outdoors", "Pets",
  "Politics", "Real Estate", "Science", "Space", "Sports", "Tech", "Travel",
  "VC", "Weather",
];

/**
 * Fetch archived ideas (all days before today).
 */
export async function fetchArchiveIdeas(): Promise<DayIdeas[]> {
  const today = getAmmanDate();

  const { data, error } = await supabase
    .from("daily_ideas")
    .select("*")
    .lt("date", today)
    .order("date", { ascending: false })
    .order("is_featured", { ascending: false });

  if (error) {
    console.error("Error fetching archive:", error);
    return [];
  }

  const dayMap = new Map<string, IdeaEntry[]>();

  for (const row of data || []) {
    const entry: IdeaEntry = {
      title: row.title,
      description: row.description,
      sourceEvent: row.source_event,
      sourceUrl: row.source_url,
      tag: row.tag,
      isFeatured: row.is_featured,
    };

    if (!dayMap.has(row.date)) dayMap.set(row.date, []);
    dayMap.get(row.date)!.push(entry);
  }

  return Array.from(dayMap.entries()).map(([date, ideas]) => ({
    date,
    ideas: ideas.sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a.tag);
      const bi = CATEGORY_ORDER.indexOf(b.tag);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    }),
  }));
}
