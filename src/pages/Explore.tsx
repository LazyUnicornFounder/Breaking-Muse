import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchIdeasForDate, IdeaEntry } from "@/lib/ideas";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, Rocket, X, Heart, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

function getAmmanDate(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Amman" });
}

const Explore = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [signedUp, setSignedUp] = useState<Set<string>>(new Set());

  const today = getAmmanDate();
  const { data, isLoading } = useQuery({
    queryKey: ["ideas", today],
    queryFn: () => fetchIdeasForDate(today),
    staleTime: 5 * 60_000,
  });

  const allIdeas: IdeaEntry[] = data
    ? Object.values(data.all).flat()
    : [];

  const currentIdea = allIdeas[currentIndex];

  const swipe = useCallback(
    (dir: "left" | "right") => {
      setDirection(dir);
      setTimeout(() => {
        setCurrentIndex((i) => Math.min(i + 1, allIdeas.length));
        setDirection(null);
      }, 300);
    },
    [allIdeas.length]
  );

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") swipe("left");
      if (e.key === "ArrowRight") swipe("right");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [swipe]);

  const handleSignup = async (idea: IdeaEntry) => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("waitlist").insert({
        email: email.trim(),
        idea_title: idea.title,
        idea_tag: idea.tag,
      });
      if (error) throw error;
      setSignedUp((prev) => new Set(prev).add(idea.title));
      toast.success("You're on the list!");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const done = currentIndex >= allIdeas.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <span className="text-xs text-muted-foreground">
          {done ? "All done!" : `${currentIndex + 1} / ${allIdeas.length}`}
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        {done ? (
          <div className="text-center max-w-sm">
            <p className="text-4xl mb-4">🎉</p>
            <h2 className="text-2xl font-bold text-foreground mb-2">You've seen them all!</h2>
            <p className="text-muted-foreground mb-6">Come back tomorrow for fresh ideas.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
              Back to home
            </Link>
          </div>
        ) : currentIdea ? (
          <div className="w-full max-w-md">
            {/* Card */}
            <div
              className={`relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out ${
                direction === "left"
                  ? "-translate-x-[120%] -rotate-12 opacity-0"
                  : direction === "right"
                  ? "translate-x-[120%] rotate-12 opacity-0"
                  : "translate-x-0 rotate-0 opacity-100"
              }`}
            >
              {/* Tag badge */}
              <div className="px-6 pt-6 pb-2">
                <span className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-sm bg-gradient-to-r from-red-600 to-red-700 text-yellow-300 shadow-sm border border-red-800/30">
                  {currentIdea.tag}
                </span>
              </div>

              {/* Content */}
              <div className="px-6 pb-4">
                <h2 className="text-2xl font-bold text-card-foreground mb-3 leading-tight">
                  {currentIdea.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {currentIdea.description}
                </p>

                {/* Source */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground/60 mb-6">
                  <span className="font-medium text-muted-foreground/70">Source:</span>
                  {currentIdea.sourceUrl ? (
                    <a href={currentIdea.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-0.5">
                      {currentIdea.sourceEvent} <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <span>{currentIdea.sourceEvent}</span>
                  )}
                </div>

                {/* Coming Soon + Signup */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Rocket className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground uppercase tracking-wide">Coming Soon</span>
                  </div>

                  {signedUp.has(currentIdea.title) ? (
                    <p className="text-sm text-green-600 font-medium">✓ You're on the waitlist!</p>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSignup(currentIdea);
                          }
                        }}
                        className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                      />
                      <button
                        onClick={() => handleSignup(currentIdea)}
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {submitting ? "..." : "Notify me"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Swipe buttons */}
            <div className="flex items-center justify-center gap-6 mt-6">
              <button
                onClick={goBack}
                disabled={currentIndex === 0}
                className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => swipe("left")}
                className="w-14 h-14 rounded-full border-2 border-destructive flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                aria-label="Skip"
              >
                <X className="w-6 h-6" />
              </button>
              <button
                onClick={() => swipe("right")}
                className="w-14 h-14 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                aria-label="Like"
              >
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <p className="text-center text-[10px] text-muted-foreground/50 mt-3">
              ← → arrow keys or tap buttons
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Explore;
