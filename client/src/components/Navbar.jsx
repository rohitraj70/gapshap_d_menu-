import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

const Navbar = () => {
  const { favorites, totalCount } = useFavorites();

  return (
    <header className="sticky top-0 z-30 border-b border-[#3a2a24] bg-[#1a1412]/90 backdrop-blur-md shadow-[0_12px_30px_-24px_rgba(0,0,0,0.6)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <img src="/Gapshap-logo.png" alt="Gapshup Cafe" className="h-10 w-10 rounded-xl object-cover shadow-card transition-transform group-hover:rotate-[-4deg]" />
          <span className="brand-name font-display text-xl font-bold tracking-tight text-[#fff8f0]">
            Gapshup <span className="text-accent">Cafe</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/favorites" aria-label={`Open favorites${favorites.length ? ` (${favorites.length})` : ""}`} title="Favorites" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#2d221d] text-[#fff8f0] transition-colors hover:bg-accent hover:text-white">
            <Heart size={17} />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shadow-card">
                {favorites.length > 99 ? "99+" : favorites.length}
              </span>
            )}
          </Link>

          <Link to="/orders" aria-label="Open my orders" title="My orders" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#2d221d] text-[#fff8f0] transition-colors hover:bg-accent hover:text-white">
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
