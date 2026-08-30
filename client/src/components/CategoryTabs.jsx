import { ChevronRight } from "lucide-react";

const CategoryTabs = ({ categories, activeId, onSelect, itemCounts = {} }) => {
  return (
    <div className="relative -mx-4 md:mx-0">
      <div className="category-tabs-scroll flex gap-2 overflow-x-auto hide-scrollbar px-4 py-1 md:flex-wrap md:overflow-visible md:px-0 md:gap-y-2">
        <button
          onClick={() => onSelect(null)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            activeId === null
              ? "bg-brown text-cream shadow-[0_10px_20px_-14px_rgba(111,78,55,0.9)]"
              : "border border-[#f0dfd0] bg-[#fffaf7] text-brown-dark hover:border-accent/60 dark:border-[#4d3b31] dark:bg-[#2d231f] dark:text-[#fff8f0]"
          }`}
        >
          All ({itemCounts.all || 0})
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onSelect(cat._id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all ${
              activeId === cat._id
                ? "bg-brown text-cream shadow-[0_10px_20px_-14px_rgba(111,78,55,0.9)]"
                : "border border-[#f0dfd0] bg-[#fffaf7] text-brown-dark hover:border-accent/60 dark:border-[#4d3b31] dark:bg-[#2d231f] dark:text-[#fff8f0]"
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
