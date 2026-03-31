import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import IdeaCard from "@/components/IdeaCard";
import { fetchRedditIdeasForDate } from "@/lib/redditIdeas";
import { Search, RefreshCw } from "lucide-react";
import MainNav from "@/components/MainNav";

const categories = [
  "All", "Architecture", "Art", "Boxing", "Cars", "Coffee", "Construction",
  "Creator", "Crypto", "Culture", "Design", "Education", "Fashion", "Film",
  "Food", "Gaming", "Health", "Humanitarian", "Law", "Living", "Money",
  "Music", "Outdoors", "Parenting", "Pets", "Politics", "Real Estate",
  "Science", "Space", "Sports", "Tech", "Travel", "VC", "Weather",
];

function getAmmanDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const MuseReddit = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const dayOffset = 0;

  const today = getAmmanDate();
  const selectedDate = addDays(today, dayOffset);

  const { data, isLoading } = useQuery({
    queryKey: ["reddit-ideas", selectedDate],
    queryFn: () => fetchRedditIdeasForDate(selectedDate),
    staleTime: 5 * 60 * 1000,
  });

  const featured = data?.featured || [];
  const allByCategory = data?.all || {};

  const availableCategories = useMemo(() => {
    const cats = Object.keys(allByCategory).sort();
    return ["All", ...cats];
  }, [allByCategory]);

  const filteredIdeas = useMemo(() => {
    const allIdeas = Object.values(allByCategory).flat();

    let ideas = activeCategory !== "All"
      ? (allByCategory[activeCategory] || [])
      : (searchQuery.trim() ? allIdeas : featured);

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
      <MainNav />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="border border-border rounded-2xl bg-card/30 backdrop-blur-sm p-5 md:p-8 shadow-sm">
          {/* Tagline */}
          <div className="flex justify-center mb-4">
            <p className="text-3xl md:text-5xl text-foreground tracking-tight font-semibold text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Turn today's Reddit complaints into your next startup idea.
            </p>
          </div>

          {/* Categories */}
          {!isLoading && data && (
            <div className="relative z-10 flex gap-1 overflow-x-auto justify-center mb-3 flex-wrap">
              {availableCategories.filter(cat => cat !== "All").map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
                  className={`text-xs font-medium transition-colors whitespace-nowrap px-2 py-1 rounded-full cursor-pointer select-none ${
                    activeCategory === cat
                      ? "bg-red-600 text-yellow-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          {!isLoading && data && (
            <div className="flex justify-center mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search today's ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                />
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <RefreshCw className="w-6 h-6 text-muted-foreground animate-spin" />
            </div>
          )}

          {/* Section heading */}
          {!isLoading && filteredIdeas.length > 0 && (
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl text-foreground">Today's Ideas</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
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

          {!isLoading && !data && (
            <p className="text-center text-muted-foreground py-12">No ideas found.</p>
          )}

          {!isLoading && data && filteredIdeas.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No ideas match your search.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default MuseReddit;
