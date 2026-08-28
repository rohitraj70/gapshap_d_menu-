import { Coffee, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-brown/10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-brown text-cream flex items-center justify-center shadow-card">
            <Coffee size={18} strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-brown-dark">
            Gapshap <span className="text-accent">Cafe</span>
          </span>
        </Link>
        <button
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="w-9 h-9 rounded-full bg-cream-dark text-brown-dark flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
