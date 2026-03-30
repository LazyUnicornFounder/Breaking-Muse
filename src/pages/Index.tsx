import IdeaCard from "@/components/IdeaCard";
import { startupIdeas } from "@/data/ideas";
import { Search } from "lucide-react";
import logo from "@/assets/logo.png";

const categories = [
  { name: "All", active: true },
  { name: "AI & ML" },
  { name: "Health & Bio" },
  { name: "Fintech" },
  { name: "Climate" },
  { name: "SaaS" },
  { name: "Consumer" },
  { name: "Media" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ideas..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Hero */}
        <div className="flex flex-col justify-center items-center h-[25vh] mb-6">
          <img src={logo} alt="Breaking Muse" className="h-56 md:h-72 w-auto" />
          <p className="text-base text-muted-foreground mt-3 text-center">
            The news that gives you business ideas
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto justify-center mb-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`text-xs font-medium transition-colors whitespace-nowrap ${
                cat.active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
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
