export interface IdeaEntry {
  title: string;
  description: string;
  sourceEvent: string;
  sourceUrl: string;
  tag: string;
}

export interface DayEntry {
  date: string; // e.g. "2026-03-30"
  displayDate: string; // e.g. "Mar 30, 2026"
  ideas: IdeaEntry[];
  previousIdeas: Record<string, IdeaEntry[]>;
}

/**
 * Get the current date in Amman timezone (UTC+3).
 * At midnight Amman time, the day rolls over and
 * today's stories move to the archive.
 */
export function getAmmanDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });
}

export function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
