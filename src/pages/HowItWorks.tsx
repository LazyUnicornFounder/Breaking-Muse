import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Newspaper, Cpu, Lightbulb, Sparkles, Rocket } from "lucide-react";
import logo from "@/assets/logo.png";

const steps: { icon: typeof Newspaper; title: string; description: ReactNode }[] = [
  {
    icon: Newspaper,
    title: "We scan the news",
    description:
      "Every morning, Breaking Muse crawls dozens of trusted news sources across 30+ categories — from tech and finance to sports, culture, and science. We pull in the freshest stories, press releases, and trending topics so you don't have to.",
  },
  {
    icon: Cpu,
    title: "AI finds the opportunity",
    description:
      "Each news event is fed into a custom AI pipeline that asks one question: \"What startup could be built because of this?\" The model reasons about market gaps, emerging demand, and timing advantages that the news creates — not generic ideas, but ones that only make sense right now.",
  },
  {
    icon: Lightbulb,
    title: "Ideas are ranked & curated",
    description:
      "From hundreds of raw candidates, we surface the top ideas per category. Featured ideas are selected for originality, timeliness, and market potential. Every idea links back to the source article so you can dig deeper and validate the opportunity yourself.",
  },
  {
    icon: Rocket,
    title: "Launch it instantly",
    description: (
      <>
        Found an idea you love? Hit the "Launch it" button on any card. It copies the idea to your clipboard and sends you straight to{" "}
        <a href="https://www.lazyunicorn.ai/lazy-launch" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">LazyUnicorn.ai</a>, where you can turn the concept into a real product — landing page, name, plan, and all — in minutes.
      </>
    ),
  },
  {
    icon: Sparkles,
    title: "Fresh batch every day",
    description:
      "The cycle repeats daily. Yesterday's news is yesterday's ideas — archived but always accessible. Today's front page becomes today's startup inspiration. Think of it as a daily creative brief powered by the real world.",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to ideas
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="Breaking Muse" className="h-16 w-auto" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            How It Works
          </h1>
        </div>

        <p className="text-muted-foreground text-lg leading-relaxed mb-10">
          Breaking Muse turns today's headlines into tomorrow's startups. Here's
          the process behind every idea you see on the site.
        </p>

        <div className="space-y-10">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-5">
              <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {i + 1}. {step.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-lg bg-muted/50 border border-border">
          <h3 className="font-semibold text-foreground mb-2">Why news-driven ideas?</h3>
          <p className="text-muted-foreground leading-relaxed">
            The best startups ride waves of change. A new regulation, a viral
            trend, a technological breakthrough — these events create windows of
            opportunity that close fast. Breaking Muse helps you spot those
            windows the moment they open, so you can move before everyone else
            catches on.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
