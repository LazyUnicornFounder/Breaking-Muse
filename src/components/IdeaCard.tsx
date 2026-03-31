import { useState, useCallback } from "react";

import { createPortal } from "react-dom";
import { ArrowUpRight, Rocket, Check } from "lucide-react";

interface PrevIdea {
  title: string;
  description: string;
  sourceEvent: string;
  sourceUrl: string;
}

interface IdeaCardProps {
  title: string;
  description: string;
  sourceEvent: string;
  sourceUrl?: string;
  tag: string;
  delay: number;
  previousIdeas?: PrevIdea[];
  historyLabel?: string;
}

const IdeaCard = ({ title, description, sourceEvent, sourceUrl, tag, delay, previousIdeas = [], historyLabel }: IdeaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [expandedIdea, setExpandedIdea] = useState<number | null>(null);
  const [showLaunchPopup, setShowLaunchPopup] = useState(false);
  const history = previousIdeas;

  const handleLaunch = useCallback((ideaTitle: string, ideaDesc: string) => {
    const text = `${ideaTitle}: ${ideaDesc}`;
    navigator.clipboard.writeText(text);
    setShowLaunchPopup(true);
    setTimeout(() => {
      window.open("https://www.lazyunicorn.ai/lazy-launch", "_blank");
    }, 3000);
    setTimeout(() => {
      setShowLaunchPopup(false);
    }, 5000);
  }, []);

  return (
    <div
      className="relative opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setExpandedIdea(null); }}
    >
      {/* Stacked cards behind — visible on hover */}
      {history.length > 0 && (
        <>
          <div
            className="absolute inset-0 bg-card border border-border rounded-lg transition-all duration-300 ease-out"
            style={{
              transform: isHovered ? "rotate(-2deg) translateY(8px) scale(0.96)" : "rotate(0) translateY(0) scale(1)",
              opacity: isHovered ? 0.5 : 0,
              zIndex: 0,
            }}
          />
          <div
            className="absolute inset-0 bg-card border border-border rounded-lg transition-all duration-300 ease-out"
            style={{
              transform: isHovered ? "rotate(1.5deg) translateY(4px) scale(0.98)" : "rotate(0) translateY(0) scale(1)",
              opacity: isHovered ? 0.7 : 0,
              zIndex: 1,
            }}
          />
        </>
      )}

      {/* Main card */}
      <div
        className={`group relative z-10 bg-card rounded-lg border border-border transition-all duration-300 ${
          isHovered ? "shadow-xl -translate-y-1" : "shadow-none"
        }`}
      >
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-sm bg-gradient-to-r from-red-600 to-red-700 text-yellow-300 shadow-sm border border-red-800/30">
              {tag}
            </span>
            {sourceUrl && (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" aria-label="Read source article">
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>

          <h3 className="font-display text-lg leading-snug mb-2 text-card-foreground">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {description}
          </p>

          <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
            <div className="min-w-0">
              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground/60 hover:text-primary transition-colors"
                >
                  <span className="font-medium text-muted-foreground/70">Source:</span> {sourceEvent} ↗
                </a>
              ) : (
                <p className="text-xs text-muted-foreground/60">
                  <span className="font-medium text-muted-foreground/70">Source:</span> {sourceEvent}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLaunch(title, description);
              }}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5" />
              Launch it
            </button>
          </div>
        </div>

        {/* History drawer — slides open on hover */}
        {history.length > 0 && (
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-out"
            style={{
              gridTemplateRows: isHovered ? "1fr" : "0fr",
            }}
          >
            <div className="overflow-hidden">
              <div className="px-5 pb-4 pt-1 border-t border-dashed border-border">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                    {historyLabel || `More ${tag} startup ideas from today's news`}
                  </span>
                </div>
                <div className="space-y-1">
                  {history.map((prev, i) => (
                    <div key={i}>
                      <button
                        type="button"
                        onClick={() => setExpandedIdea(expandedIdea === i ? null : i)}
                        className="w-full flex items-center justify-between gap-2 py-1.5 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors text-left group/prev cursor-pointer"
                      >
                        <p className="text-xs text-muted-foreground truncate group-hover/prev:text-foreground transition-colors">
                          {prev.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">{historyLabel === "Previous ideas today" ? "today" : ""}</span>
                      </button>

                      {/* Expanded detail */}
                      <div
                        className="grid transition-[grid-template-rows] duration-200 ease-out"
                        style={{
                          gridTemplateRows: expandedIdea === i ? "1fr" : "0fr",
                        }}
                      >
                        <div className="overflow-hidden">
                          <div className="ml-2 pl-3 border-l-2 border-primary/30 py-2 mb-1">
                            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
                              {prev.description}
                            </p>
                            {prev.sourceUrl ? (
                              <a
                                href={prev.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-muted-foreground hover:text-primary transition-colors"
                              >
                                <span className="font-medium text-card-foreground">Source:</span> {prev.sourceEvent} ↗
                              </a>
                            ) : prev.sourceEvent ? (
                              <p className="text-[10px] text-muted-foreground">
                                <span className="font-medium text-card-foreground">Source:</span> {prev.sourceEvent}
                              </p>
                            ) : null}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLaunch(prev.title, prev.description);
                              }}
                              className="mt-2 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                            >
                              <Rocket className="w-3 h-3" />
                              Launch it
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showLaunchPopup && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div className="bg-black border-2 border-red-600 rounded-xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3 animate-fade-in pointer-events-auto">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
              <Check className="w-6 h-6 text-yellow-300" />
            </div>
            <p className="text-lg font-bold text-yellow-300 text-center">Idea copied!</p>
            <p className="text-sm text-red-400 text-center">Redirecting to lazyunicorn.ai to launch your idea…</p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default IdeaCard;
