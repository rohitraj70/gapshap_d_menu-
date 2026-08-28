const CategoryTabs = ({ categories, activeId, onSelect, itemCounts = {} }) => {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1 -mx-4 px-4">
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
  );
};

export default CategoryTabs;
