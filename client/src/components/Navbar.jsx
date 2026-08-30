import { Heart, Moon, ShoppingBag, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { favorites, totalCount } = useFavorites();

  return (
    <header className="sticky top-0 z-30 border-b border-brown/10 bg-[#fffaf5]/90 backdrop-blur-md shadow-[0_12px_30px_-24px_rgba(111,78,55,0.38)] dark:border-[#4d3a32] dark:bg-[#201914]/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <img src="/Gapshap-logo.png" alt="Gapshap Cafe" className="h-10 w-10 rounded-xl object-cover shadow-card transition-transform group-hover:rotate-[-4deg]" />
          <span className="brand-name font-display text-xl font-bold tracking-tight text-brown-dark dark:text-[#fff8f0]">
            Gapshap <span className="text-accent">Cafe</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/favorites" aria-label={`Open favorites${favorites.length ? ` (${favorites.length})` : ""}`} title="Favorites" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eadf] text-brown-dark transition-colors hover:bg-accent hover:text-white dark:bg-[#352a25] dark:text-[#fff8f0]">
            <Heart size={17} />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shadow-card">
                {favorites.length > 99 ? "99+" : favorites.length}
              </span>
            )}
          </Link>

          <Link to="/orders" aria-label="Open my orders" title="My orders" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eadf] text-brown-dark transition-colors hover:bg-accent hover:text-white dark:bg-[#352a25] dark:text-[#fff8f0]">
            <ShoppingBag size={17} />
            {totalCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brown px-1 text-[10px] font-bold text-white shadow-card">
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            )}
          </Link>

          <Link to="/orders" aria-label="Open my orders" title="My orders" className="hidden h-10 items-center gap-2 rounded-full bg-brown px-3 text-xs font-semibold text-cream transition-colors hover:bg-brown-dark sm:flex">
            My Orders
          </Link>
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5eadf] text-brown-dark transition-colors hover:bg-accent hover:text-white dark:bg-[#352a25] dark:text-[#fff8f0]"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
