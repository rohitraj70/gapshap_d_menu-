import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search for chai, sandwiches, pasta…" }) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-light" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white rounded-full pl-11 pr-10 py-3 text-sm text-brown-dark placeholder:text-brown-light/70 shadow-card border border-brown/10 focus:border-accent outline-none transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light hover:text-brown-dark transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
