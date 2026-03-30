import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowUpRight, ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { fetchArchiveIdeas } from "@/lib/ideas";
import logo from "@/assets/logo.png";

const Archive = () => {
  const { data: archiveDays = [], isLoading } = useQuery({
    queryKey: ["archive-ideas"],
    queryFn: fetchArchiveIdeas,
    staleTime: 5 * 60 * 1000,
  });

  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);

  // Auto-expand first day when data loads
  if (archiveDays.length > 0 && expandedDay === null) {
    setExpandedDay(archiveDays[0].date);
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to today
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="Breaking Muse" className="h-16 w-auto" />
          <div>
            <h1 className="font-display text-2xl text-card-foreground">Idea Archive</h1>
            <p className="text-sm text-muted-foreground">Previous days' business ideas from the news</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center py-16">
            <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        )}

        {!isLoading && archiveDays.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No archived ideas yet. Check back tomorrow!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {archiveDays.map((day) => (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {day.ideas.map((idea, i) => {
                        const ideaKey = `${day.date}-${i}`;
                        return (
                          <div key={ideaKey} className="border border-border rounded-lg p-4 bg-background">
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm bg-gradient-to-r from-red-600 to-red-700 text-yellow-300 shadow-sm border border-red-800/30">
                                {idea.tag}
                              </span>
                              {idea.isFeatured && (
                                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => setExpandedIdea(expandedIdea === ideaKey ? null : ideaKey)}
                              className="text-left w-full"
                            >
                              <h4 className="font-display text-sm leading-snug text-card-foreground mb-1">
                                {idea.title}
                              </h4>
                            </button>
                            {expandedIdea === ideaKey && (
                              <div className="mt-2 animate-fade-in">
                                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                                  {idea.description}
                                </p>
                                {idea.sourceUrl && (
                                  <a
                                    href={idea.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    <span className="font-medium text-card-foreground">Source:</span> {idea.sourceEvent}
                                    <ArrowUpRight className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Archive;
