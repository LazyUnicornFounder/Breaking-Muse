import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const MainNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-3 items-center">
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
          <a href="https://x.com/SaadSahawneh" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/70 transition-colors">
            <Twitter className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between">
        <Link to="/">
          <img src={logo} alt="Breaking Muse" className="h-24 w-auto drop-shadow-lg" />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden flex flex-col gap-3 py-4 border-b border-border">
          <Link to="/how-it-works" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-foreground hover:text-foreground/70 transition-colors">
            How it works
          </Link>
          <Link to="/archive" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-foreground hover:text-foreground/70 transition-colors">
            Archive
          </Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-foreground hover:text-foreground/70 transition-colors">
            About
          </Link>
        </nav>
      )}
    </header>
  );
};

export default MainNav;
