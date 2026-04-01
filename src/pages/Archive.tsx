import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, RefreshCw, Search } from "lucide-react";
import { fetchArchiveIdeas, type IdeaEntry } from "@/lib/ideas";
import IdeaCard from "@/components/IdeaCard";
import MainNav from "@/components/MainNav";

const Archive = () => {
  const { data: archiveDays = [], isLoading } = useQuery({
    queryKey: ["archive-ideas"],
    queryFn: fetchArchiveIdeas,
    staleTime: 5 * 60 * 1000,
  });

  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-expand first day when data loads (once)
  if (archiveDays.length > 0 && !initialized) {
    setExpandedDays(new Set([archiveDays[0].date]));
    setInitialized(true);
  }

  const toggleDay = (date: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  /** Group ideas by tag, return one featured per category + rest as previous */
  const groupByCategory = (ideas: IdeaEntry[]) => {
    const byTag: Record<string, IdeaEntry[]> = {};
    for (const idea of ideas) {
      if (!byTag[idea.tag]) byTag[idea.tag] = [];
      byTag[idea.tag].push(idea);
    }

    const CATEGORY_ORDER = [
      "Architecture", "Art", "Boxing", "Cars", "Coffee", "Construction",
      "Creator", "Crypto", "Culture", "Design", "Education", "Fashion", "Film",
      "Food", "Gaming", "Health", "Humanitarian", "Law", "Living", "Money",
      "Music", "Outdoors", "Parenting", "Pets", "Politics", "Real Estate",
      "Science", "Space", "Sports", "Tech", "Travel", "VC", "Weather",
    ];

    const result: { featured: IdeaEntry; others: IdeaEntry[] }[] = [];
    const sortedTags = Object.keys(byTag).sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
    for (const tag of sortedTags) {
      const tagIdeas = byTag[tag];
      const feat = tagIdeas.find((i) => i.isFeatured) || tagIdeas[0];
      const others = tagIdeas.filter((i) => i !== feat);
      result.push({ featured: feat, others });
    }
    return result;
  };

  return (
    <div className="min-h-screen">
      <MainNav />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="font-display text-2xl text-card-foreground mb-1">Idea Archive</h1>
        <p className="text-sm text-muted-foreground mb-6">Previous days' startup ideas from the news</p>

        {/* Search */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ideas in the archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        )}

        {!isLoading && archiveDays.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Archive will start filling soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {archiveDays.map((day) => {
              const q = searchQuery.toLowerCase().trim();
              const filteredIdeas = q
                ? day.ideas.filter(idea =>
                    idea.title.toLowerCase().includes(q) ||
                    idea.description.toLowerCase().includes(q) ||
                    idea.tag.toLowerCase().includes(q) ||
                    idea.sourceEvent.toLowerCase().includes(q)
                  )
                : day.ideas;
              if (q && filteredIdeas.length === 0) return null;
              const grouped = groupByCategory(filteredIdeas);
              return (
                <div key={day.date} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleDay(day.date)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {expandedDay === day.date ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <h2 className="font-display text-lg text-card-foreground">{formatDate(day.date)}</h2>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {day.ideas.length} ideas
                      </span>
                    </div>
                  </button>

                  {expandedDay === day.date && (
                    <div className="border-t border-border px-5 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {grouped.map(({ featured, others }, i) => (
                          <IdeaCard
                            key={`${day.date}-${featured.tag}`}
                            title={featured.title}
                            description={featured.description}
                            sourceEvent={featured.sourceEvent}
                            sourceUrl={featured.sourceUrl}
                            tag={featured.tag}
                            delay={i * 60}
                            historyLabel={`More ${featured.tag} ideas`}
                            previousIdeas={others.map((p) => ({
                              title: p.title,
                              description: p.description,
                              sourceEvent: p.sourceEvent,
                              sourceUrl: p.sourceUrl,
                            }))}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Archive;
