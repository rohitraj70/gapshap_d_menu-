import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search for chai, sandwiches, pasta…" }) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-light dark:text-[#f0c28c]" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-[#f0dfd0] bg-[#fffaf7] py-3 pl-11 pr-10 text-sm text-brown-dark shadow-[0_10px_24px_-18px_rgba(111,78,55,0.7)] outline-none transition-colors placeholder:text-brown-light/70 focus:border-accent dark:border-[#4d3b31] dark:bg-[#2d231f] dark:text-[#fff8f0] dark:placeholder:text-[#d7bba3]"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light transition-colors hover:text-brown-dark dark:text-[#f0c28c] dark:hover:text-[#fff8f0]"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
