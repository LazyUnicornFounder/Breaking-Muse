import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import IdeaCard from "@/components/IdeaCard";
import { fetchTodayIdeas } from "@/lib/ideas";
import { Search, Archive, RefreshCw } from "lucide-react";
import logo from "@/assets/logo.png";

const categories = [
  "All", "Health", "Weather", "Sports", "Food", "Film", "Music",
  "Culture", "Fashion", "Space", "Pets", "Travel", "Cars", "Politics", "Science", "Money",
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["today-ideas"],
    queryFn: fetchTodayIdeas,
    staleTime: 5 * 60 * 1000,
  });

  const featured = data?.featured || [];
  const allByCategory = data?.all || {};

  const filteredIdeas = useMemo(() => {
    let ideas = activeCategory !== "All"
      ? (allByCategory[activeCategory] || [])
      : featured;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      ideas = ideas.filter(
        (idea) =>
          idea.title.toLowerCase().includes(q) ||
          idea.description.toLowerCase().includes(q) ||
          idea.tag.toLowerCase().includes(q) ||
          idea.sourceEvent.toLowerCase().includes(q)
      );
    }

    return ideas;
  }, [searchQuery, activeCategory, featured, allByCategory]);

  return (
    <div className="min-h-screen">
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
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
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

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
          </div>
        )}

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredIdeas.map((idea, i) => {
            // When showing "All", pass non-featured ideas as previous ideas for hover
            const prevIdeas = activeCategory === "All"
              ? (allByCategory[idea.tag] || [])
                  .filter((p) => p.title !== idea.title)
                  .map((p) => ({
                    title: p.title,
                    description: p.description,
                    sourceEvent: p.sourceEvent,
                    sourceUrl: p.sourceUrl,
                  }))
              : [];

            return (
              <IdeaCard
                key={`${idea.tag}-${idea.title}`}
                title={idea.title}
                description={idea.description}
                sourceEvent={idea.sourceEvent}
                sourceUrl={idea.sourceUrl}
                tag={idea.tag}
                delay={i * 60}
                previousIdeas={prevIdeas}
              />
            );
          })}
        </div>

        {!isLoading && filteredIdeas.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No ideas found.</p>
        )}

        {/* Archive link */}
        <div className="flex justify-center mt-8 mb-4">
          <Link
            to="/archive"
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Archive className="w-4 h-4" />
            View previous days' ideas
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;
