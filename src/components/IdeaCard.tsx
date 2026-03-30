import { useState } from "react";
import { ArrowUpRight, Clock, X } from "lucide-react";
import { previousIdeas } from "@/data/previousIdeas";

interface IdeaCardProps {
  title: string;
  description: string;
  sourceEvent: string;
  sourceUrl?: string;
  tag: string;
  delay: number;
}

const IdeaCard = ({ title, description, sourceEvent, sourceUrl, tag, delay }: IdeaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [expandedIdea, setExpandedIdea] = useState<number | null>(null);
  const history = previousIdeas[tag] || [];

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
        className={`relative z-10 bg-card rounded-lg border border-border transition-all duration-300 ${
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

          <div className="pt-3 border-t border-border">
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="font-medium text-card-foreground">Source:</span> {sourceEvent} ↗
              </a>
            ) : (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-card-foreground">Source:</span> {sourceEvent}
              </p>
            )}
          </div>
        </div>

        {/* History drawer — slides open on hover */}
        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: isHovered && history.length > 0 ? "400px" : "0px",
            opacity: isHovered ? 1 : 0,
          }}
        >
          <div className="px-5 pb-4 pt-1 border-t border-dashed border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Previous ideas today
              </span>
            </div>
            <div className="space-y-1">
              {history.map((prev, i) => (
                <div key={i}>
                  <button
                    onClick={() => setExpandedIdea(expandedIdea === i ? null : i)}
                    className="w-full flex items-center justify-between gap-2 py-1.5 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors text-left group/prev"
                  >
                    <p className="text-xs text-muted-foreground truncate group-hover/prev:text-foreground transition-colors">
                      {prev.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">{prev.date}</span>
                  </button>

                  {/* Expanded previous idea */}
                  <div
                    className="overflow-hidden transition-all duration-200 ease-out"
                    style={{
                      maxHeight: expandedIdea === i ? "200px" : "0px",
                      opacity: expandedIdea === i ? 1 : 0,
                    }}
                  >
                    <div className="ml-2 pl-3 border-l-2 border-primary/30 py-2 mb-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-card-foreground font-medium mb-1">{prev.title}</p>
                        <button
                          onClick={() => setExpandedIdea(null)}
                          className="shrink-0 p-0.5 rounded hover:bg-muted transition-colors"
                        >
                          <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
