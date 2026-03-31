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

  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-expand first day when data loads
  if (archiveDays.length > 0 && expandedDay === null) {
    setExpandedDay(archiveDays[0].date);
  }

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

    const result: { featured: IdeaEntry; others: IdeaEntry[] }[] = [];
    for (const [, tagIdeas] of Object.entries(byTag)) {
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
        <p className="text-sm text-muted-foreground mb-8">Previous days' business ideas from the news</p>

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
              const grouped = groupByCategory(day.ideas);
              return (
                <div key={day.date} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
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
