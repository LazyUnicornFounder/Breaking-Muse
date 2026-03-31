import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const About = () => {
  return (
    <div className="min-h-screen">
      <header className="max-w-7xl mx-auto px-6 pt-4 grid grid-cols-3 items-center">
        <Link to="/">
          <img src={logo} alt="Breaking Muse" className="h-40 md:h-48 w-auto drop-shadow-lg" />
        </Link>
        <div className="flex items-center justify-center gap-6">
          <Link to="/how-it-works" className="text-sm font-semibold text-foreground hover:text-foreground/70 transition-colors">
            How it works
          </Link>
          <Link to="/archive" className="text-sm font-semibold text-foreground hover:text-foreground/70 transition-colors">
            Archive
          </Link>
          <Link to="/about" className="text-sm font-semibold text-foreground hover:text-foreground/70 transition-colors">
            About
          </Link>
        </div>
        <div className="flex justify-end">
          <a href="https://www.producthunt.com/products/breaking-muse?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-breaking-muse" target="_blank" rel="noopener noreferrer" className="shrink-0">
            <img alt="Breaking Muse - Turn today's news into your next startup idea. | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1111765&theme=dark&t=1774937954258" />
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground text-center">About</h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          The best startups ride waves of change. A new regulation, a viral trend, a technological breakthrough — these events create windows of opportunity that close fast. Breaking Muse helps you spot those windows the moment they open, so you can move before everyone else catches on.
        </p>
        <p className="text-base text-muted-foreground leading-relaxed">
          Breaking Muse is associated with{" "}
          <a href="https://lazyunicorn.ai" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-foreground/70 transition-colors">
            Lazy Unicorn
          </a>
          , which helps you launch your autonomous business on{" "}
          <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-foreground/70 transition-colors">
            Lovable
          </a>
          . Click the "Launch it" button for your favorite idea, and you'll be taken to Lazy Unicorn to start turning your idea into a business that runs and grows itself.
        </p>
      </main>
    </div>
  );
};

export default About;
