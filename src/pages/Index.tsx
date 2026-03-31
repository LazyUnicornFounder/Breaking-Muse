import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import IdeaCard from "@/components/IdeaCard";
import { fetchIdeasForDate } from "@/lib/ideas";
import { supabase } from "@/integrations/supabase/client";
import { Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

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

function formatDateLabel(dateStr: string, today: string): string {
  if (dateStr === today) return "Today";
  if (dateStr === addDays(today, -1)) return "Yesterday";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const queryClient = useQueryClient();
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

  const handleRegenerate = async () => {
    const password = window.prompt("Enter admin password:");
    if (!password) return;

    setIsRegenerating(true);
    toast.info("Regenerating ideas... this may take a few minutes.");

    try {
      const { data, error } = await supabase.functions.invoke("admin-regenerate", {
        body: { password },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Regenerated ${data?.generation?.count || 0} ideas!`);
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to regenerate");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="max-w-7xl mx-auto px-6 pt-4 grid grid-cols-3 items-center">
        <img src={logo} alt="Breaking Muse" className="h-40 md:h-48 w-auto drop-shadow-lg" />
        <div className="flex items-center justify-center gap-6">
          <Link to="/how-it-works" className="text-sm font-semibold text-foreground hover:text-foreground/70 transition-colors">
            How it works
          </Link>
          <Link to="/archive" className="text-sm font-semibold text-foreground hover:text-foreground/70 transition-colors">
            Archive
          </Link>
        </div>
        <div className="flex justify-end">
          <a href="https://www.producthunt.com/products/breaking-muse?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-breaking-muse" target="_blank" rel="noopener noreferrer" className="shrink-0">
            <img alt="Breaking Muse - Turn today's news into your next startup idea. | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1111765&theme=dark&t=1774937954258" />
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Tagline */}
        <div className="flex justify-center mb-4">
          <p className="text-3xl md:text-5xl text-foreground tracking-tight font-semibold text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Turn today's news into your next startup idea.
          </p>
        </div>
        {/* Categories */}
        <div className="relative z-10 flex gap-1 overflow-x-auto justify-center mb-3 flex-wrap">
          {availableCategories.map((cat) => (
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

        {/* About section */}
        <div className="mt-16 mb-8 max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">About</h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            The best startups ride waves of change. A new regulation, a viral trend, a technological breakthrough — these events create windows of opportunity that close fast. Breaking Muse helps you spot those windows the moment they open, so you can move before everyone else catches on.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Breaking Muse is associated with{" "}
            <a href="https://lazyunicorn.app" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-foreground/70 transition-colors">
              Lazy Unicorn
            </a>
            , which helps you launch your autonomous business on{" "}
            <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-foreground/70 transition-colors">
              Lovable
            </a>
            . Click the "Launch it" button for your favorite idea, and you'll be taken to Lazy Unicorn to start turning your idea into a business that runs and grows itself.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
