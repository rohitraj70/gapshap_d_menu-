import { Coffee } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
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
      </div>
    </header>
  );
};

export default Navbar;
