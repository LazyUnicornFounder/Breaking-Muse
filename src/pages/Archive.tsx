import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ChevronDown, ChevronRight } from "lucide-react";
import { archive } from "@/data/archive";
import logo from "@/assets/logo.png";

const Archive = () => {
  const [expandedDay, setExpandedDay] = useState<string | null>(archive[0]?.date || null);
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);

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

        {archive.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No archived ideas yet. Check back tomorrow!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {archive.map((day) => (
              <div key={day.date} className="border border-border rounded-lg overflow-hidden">
                {/* Day header */}
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
                    <h2 className="font-display text-lg text-card-foreground">{day.displayDate}</h2>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {day.ideas.length} ideas
                    </span>
                  </div>
                </button>

                {/* Day content */}
                {expandedDay === day.date && (
                  <div className="border-t border-border">
                    {/* Main ideas */}
                    <div className="px-5 py-4">
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                        Featured Ideas
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {day.ideas.map((idea, i) => {
                          const ideaKey = `${day.date}-${i}`;
                          return (
                            <div key={i} className="border border-border rounded-lg p-4 bg-background">
                              <div className="flex items-start justify-between mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm bg-gradient-to-r from-red-600 to-red-700 text-yellow-300 shadow-sm border border-red-800/30">
                                  {idea.tag}
                                </span>
                                {idea.sourceUrl && (
                                  <a href={idea.sourceUrl} target="_blank" rel="noopener noreferrer">
                                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
                                  </a>
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
                                      className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      <span className="font-medium text-card-foreground">Source:</span> {idea.sourceEvent} ↗
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Previous ideas for that day */}
                    {Object.keys(day.previousIdeas).length > 0 && (
                      <div className="px-5 py-4 border-t border-dashed border-border">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                          Other Ideas That Day
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(day.previousIdeas).flatMap(([, ideas]) =>
                            ideas.map((idea, i) => {
                              const ideaKey = `${day.date}-prev-${idea.tag}-${i}`;
                              return (
                                <div key={ideaKey} className="border border-border/50 rounded-lg p-3 bg-background/50">
                                  <div className="flex items-start justify-between mb-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm bg-gradient-to-r from-red-600 to-red-700 text-yellow-300 shadow-sm border border-red-800/30">
                                      {idea.tag}
                                    </span>
                                    {idea.sourceUrl && (
                                      <a href={idea.sourceUrl} target="_blank" rel="noopener noreferrer">
                                        <ArrowUpRight className="w-3 h-3 text-muted-foreground hover:text-primary transition-colors" />
                                      </a>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => setExpandedIdea(expandedIdea === ideaKey ? null : ideaKey)}
                                    className="text-left w-full"
                                  >
                                    <h4 className="text-xs leading-snug text-card-foreground">
                                      {idea.title}
                                    </h4>
                                  </button>
                                  {expandedIdea === ideaKey && (
                                    <div className="mt-2 animate-fade-in">
                                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                                        {idea.description}
                                      </p>
                                      {idea.sourceUrl && (
                                        <a
                                          href={idea.sourceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
                                        >
                                          <span className="font-medium text-card-foreground">Source:</span> {idea.sourceEvent} ↗
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
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
