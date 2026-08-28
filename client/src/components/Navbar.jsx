import { Heart, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-brown/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/Gapshap-logo.png" alt="Gapshap Cafe" className="w-10 h-10 rounded-xl object-cover shadow-card group-hover:rotate-[-4deg] transition-transform" />
          <span className="brand-name font-display text-xl font-bold tracking-tight text-brown-dark">
            Gapshap <span className="text-accent">Cafe</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/favorites" aria-label={`Open favorites${favorites.length ? ` (${favorites.length})` : ""}`} title="Favorites" className="relative w-10 h-10 rounded-full bg-cream-dark text-brown-dark flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
            <Heart size={17} />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shadow-card">
                {favorites.length > 99 ? "99+" : favorites.length}
              </span>
            )}
          </Link>
          <Link to="/orders" aria-label="Open my orders" title="My orders" className="hidden sm:flex h-10 items-center gap-2 rounded-full bg-brown px-3 text-xs font-semibold text-cream hover:bg-brown-dark transition-colors">
            My Orders
          </Link>
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="w-10 h-10 rounded-full bg-cream-dark text-brown-dark flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
