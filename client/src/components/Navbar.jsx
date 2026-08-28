import { Heart, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-brown/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src="/Gapshap-logo.png" alt="Gapshap Cafe" className="w-10 h-10 rounded-xl object-cover shadow-card group-hover:rotate-[-4deg] transition-transform" />
          <span className="font-display text-xl font-semibold tracking-tight text-brown-dark">
            Gapshap <span className="text-accent">Cafe</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/favorites" aria-label="Open my selection" title="My selection" className="w-10 h-10 rounded-full bg-cream-dark text-brown-dark flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
            <Heart size={17} />
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
