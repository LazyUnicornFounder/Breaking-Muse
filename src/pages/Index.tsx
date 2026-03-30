import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import IdeaCard from "@/components/IdeaCard";
import { fetchIdeasForDate } from "@/lib/ideas";
import { Search, Archive, RefreshCw } from "lucide-react";
import logo from "@/assets/logo.png";

const categories = [
  "All", "Health", "Weather", "Sports", "Food", "Film", "Music",
  "Culture", "Fashion", "Space", "Pets", "Travel", "Cars", "Politics", "Science", "Money", "Education", "Gaming", "Creator",
];

function getAmmanDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(dateStr: string, today: string): string {
  if (dateStr === today) return "Today";
  if (dateStr === addDays(today, -1)) return "Yesterday";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const dayOffset = 0;

  const today = getAmmanDate();
  const selectedDate = addDays(today, dayOffset);

  const { data, isLoading } = useQuery({
    queryKey: ["ideas", selectedDate],
    queryFn: () => fetchIdeasForDate(selectedDate),
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
            Turn today's news into your next startup idea.
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-1.5 overflow-x-auto justify-center mb-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
              className={`text-xs font-medium transition-colors whitespace-nowrap px-3 py-1 rounded-full ${
                activeCategory === cat
                  ? "bg-red-600 text-yellow-300"
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
