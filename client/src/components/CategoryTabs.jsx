import { ChevronRight } from "lucide-react";

const CategoryTabs = ({ categories, activeId, onSelect, itemCounts = {} }) => {
  return (
    <div className="relative -mx-4 md:mx-0">
      <div className="category-tabs-scroll flex gap-2 overflow-x-auto hide-scrollbar py-1 px-4 md:flex-wrap md:overflow-visible md:px-0 md:gap-y-2">
        <button
          onClick={() => onSelect(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activeId === null
              ? "bg-brown text-cream shadow-card"
              : "bg-white text-brown-dark border border-brown/10 hover:border-accent/50"
          }`}
        >
          All ({itemCounts.all || 0})
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onSelect(cat._id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeId === cat._id
                ? "bg-brown text-cream shadow-card"
                : "bg-white text-brown-dark border border-brown/10 hover:border-accent/50"
            }`}
          >
            {cat.name} ({itemCounts[cat._id] || 0})
          </button>
        ))}
      </div>
      <div className="category-tabs-cue pointer-events-none absolute right-0 top-0 hidden h-full items-center pl-7 pr-1 md:hidden">
        <ChevronRight size={17} />
      </div>
    </div>
  );
};

export default CategoryTabs;
