import MainNav from "@/components/MainNav";

const About = () => {
  return (
    <div className="min-h-screen">
      <MainNav />

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground text-center">About</h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          The best startups ride waves of change. A new regulation, a viral trend, a technological breakthrough — these events create windows of opportunity that close fast. Breaking Muse helps you spot those windows the moment they open, so you can move before everyone else catches on.
        </p>
        <p className="text-base text-muted-foreground leading-relaxed">
          Breaking Muse is part of{" "}
          <a href="https://lazyfactoryventures.com" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-foreground/70 transition-colors">
            Lazy Factory Ventures
          </a>
          .
        </p>
      </main>
    </div>
  );
};

export default About;
