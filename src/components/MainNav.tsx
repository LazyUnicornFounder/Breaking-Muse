import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const MainNav = () => {
  return (
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
          <img alt="Breaking Muse - Turn today's news into your next startup idea. | Product Hunt" width="175" height="38" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1111765&theme=dark&t=1774937954258" />
        </a>
      </div>
    </header>
  );
};

export default MainNav;
