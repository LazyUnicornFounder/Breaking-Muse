import IdeaCard from "@/components/IdeaCard";
import { startupIdeas } from "@/data/ideas";
import { Search, Cpu, Heart, DollarSign, Leaf, Cloud, ShoppingBag, Newspaper, Zap } from "lucide-react";

const categories = [
  { name: "All", icon: Zap, active: true },
  { name: "AI & ML", icon: Cpu },
  { name: "Health & Bio", icon: Heart },
  { name: "Fintech", icon: DollarSign },
  { name: "Climate", icon: Leaf },
  { name: "SaaS", icon: Cloud },
  { name: "Consumer", icon: ShoppingBag },
  { name: "Media", icon: Newspaper },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-foreground tracking-tight">Breaking Muse</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ideas..."
              className="pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>
        {/* Category nav */}
        <div className="max-w-7xl mx-auto px-6 pb-3 flex gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                cat.active
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Hero */}
        <div className="flex flex-col justify-center items-center h-[40vh] mb-8">
          <h1 className="font-display text-6xl md:text-7xl text-foreground italic text-center">
            Breaking Muse
          </h1>
          <p className="text-base text-muted-foreground mt-3 text-center">
            The news that gives you business ideas
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {startupIdeas.map((idea, i) => (
            <IdeaCard
              key={i}
              title={idea.title}
              description={idea.description}
              sourceEvent={idea.sourceEvent}
              tag={idea.tag}
              tagColor={idea.tagColor}
              delay={i * 60}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
