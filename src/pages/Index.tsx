import { useState, useMemo } from "react";
import IdeaCard from "@/components/IdeaCard";
import { startupIdeas } from "@/data/ideas";
import { Search } from "lucide-react";
import logo from "@/assets/logo.png";

const categories = [
  { name: "All", active: true },
  { name: "Health" },
  { name: "Weather" },
  
  { name: "Sports" },
  { name: "Food" },
  { name: "Film" },
  { name: "Music" },
  { name: "Culture" },
  { name: "Fashion" },
  { name: "Space" },
  { name: "Pets" },
  { name: "Travel" },
  { name: "Cars" },
  { name: "Politics" },
  { name: "Science" },
  { name: "Money" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIdeas = useMemo(() => {
    if (!searchQuery.trim()) return startupIdeas;
    const q = searchQuery.toLowerCase();
    return startupIdeas.filter(
      (idea) =>
        idea.title.toLowerCase().includes(q) ||
        idea.description.toLowerCase().includes(q) ||
        idea.tag.toLowerCase().includes(q) ||
        idea.sourceEvent.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen">
      {/* Header - just logo area */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-2" />
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Hero */}
        <div className="flex items-center justify-center gap-3 h-[18vh] mb-2">
          <img src={logo} alt="Breaking Muse" className="h-48 md:h-60 w-auto drop-shadow-lg" />

          <p className="font-display text-2xl md:text-3xl text-muted-foreground italic whitespace-nowrap">
            Business ideas from today's news
          </p>
        </div>

        {/* Coming Soon + Email */}
        <div className="flex flex-col items-center mb-8">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-primary/10 text-primary rounded-full mb-3">
            Coming Soon
          </span>
          <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
            Drop your email to get fresh business ideas in your inbox daily.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem("email") as HTMLInputElement;
              if (input.value) {
                input.value = "";
                alert("Thanks! We'll keep you posted.");
              }
            }}
            className="flex gap-2 w-full max-w-sm"
          >
            <input
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 px-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Notify Me
            </button>
          </form>
        </div>

        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto justify-center mb-3 flex-wrap">
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

        {/* Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredIdeas.map((idea, i) => (
            <IdeaCard
              key={idea.title}
              title={idea.title}
              description={idea.description}
              sourceEvent={idea.sourceEvent}
              sourceUrl={idea.sourceUrl}
              tag={idea.tag}
              delay={i * 60}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
