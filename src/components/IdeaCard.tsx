import { ArrowUpRight } from "lucide-react";

interface IdeaCardProps {
  title: string;
  description: string;
  sourceEvent: string;
  sourceUrl?: string;
  tag: string;
  delay: number;
}

const IdeaCard = ({ title, description, sourceEvent, sourceUrl, tag, delay }: IdeaCardProps) => {
  return (
    <div
      className="group bg-card rounded-lg p-5 border border-border hover:shadow-lg transition-all duration-300 opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
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
  );
};

export default IdeaCard;
