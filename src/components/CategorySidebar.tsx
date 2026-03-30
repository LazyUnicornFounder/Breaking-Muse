import { Cpu, Heart, DollarSign, Leaf, Cloud, ShoppingBag, Newspaper, Zap } from "lucide-react";

const categories = [
  { name: "All Ideas", icon: Zap, active: true },
  { name: "AI & ML", icon: Cpu },
  { name: "Health & Bio", icon: Heart },
  { name: "Fintech", icon: DollarSign },
  { name: "Climate", icon: Leaf },
  { name: "SaaS", icon: Cloud },
  { name: "Consumer", icon: ShoppingBag },
  { name: "Media", icon: Newspaper },
];

const CategorySidebar = () => {
  return (
    <aside className="w-56 shrink-0 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 pb-4">
        <h1 className="font-display text-xl text-sidebar-primary tracking-tight">
          Breaking Muse
        </h1>
        <p className="text-xs text-sidebar-foreground mt-1">The news that gives you business ideas</p>
      </div>

      <nav className="flex-1 px-3">
        <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground px-3 mb-2 font-medium">
          Categories
        </p>
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
              cat.active
                ? "bg-secondary text-sidebar-primary font-medium"
                : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-secondary"
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.name}
          </button>
        ))}
      </nav>

      <div className="p-4 mx-3 mb-4 rounded-lg bg-secondary">
        <p className="text-xs font-medium text-foreground">March 30, 2026</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">24 ideas generated from 58 news events</p>
      </div>
    </aside>
  );
};

export default CategorySidebar;
