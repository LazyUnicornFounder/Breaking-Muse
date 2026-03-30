import CategorySidebar from "@/components/CategorySidebar";
import IdeaCard from "@/components/IdeaCard";
import { startupIdeas } from "@/data/ideas";
import { Search } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen">
      <CategorySidebar />

      <main className="flex-1 px-8 py-6">
        {/* Hero */}
        <div className="flex flex-col justify-center items-center h-[45vh] mb-8">
          <h1 className="font-display text-6xl md:text-7xl text-foreground italic text-center">
            Breaking Muse
          </h1>
          <p className="text-base text-muted-foreground mt-3 text-center">
            The news that gives you business ideas
          </p>
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ideas..."
              className="pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-lg w-72 focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {startupIdeas.map((idea, i) => (
            <IdeaCard
              key={i}
              title={idea.title}
              description={idea.description}
              sourceEvent={idea.sourceEvent}
              tag={idea.tag}
              tagColor={idea.tagColor}
              delay={i * 60}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
