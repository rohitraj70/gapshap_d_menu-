import { ArrowLeft, Heart, HeartOff, ImageOff, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";
import EmptyState from "../components/EmptyState";

const FavoritesList = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} aria-label="Go back" className="text-brown-dark"><ArrowLeft size={22} /></button>
          <h1 className="font-display text-lg font-semibold text-brown-dark">Favorites</h1>
        </div>
        <EmptyState icon={HeartOff} title="No favorites yet" description="Tap the heart on any dish to save it here." action={<Link to="/" className="text-sm font-semibold text-accent">Browse the menu</Link>} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-10">
      <div className="sticky top-0 z-20 border-b border-brown/10 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} aria-label="Go back" className="text-brown-dark"><ArrowLeft size={22} /></button>
          <h1 className="flex-1 font-display text-lg font-semibold text-brown-dark">Favorites</h1>
          <Heart size={18} className="fill-accent text-accent" />
        </div>
      </div>
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 px-4 pt-4 sm:grid-cols-3">
        {favorites.map((item) => (
          <motion.div key={item._id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-xl2 border border-brown/5 bg-white shadow-card">
            <Link to={`/food/${item._id}`}>
              <div className="aspect-[4/3] bg-cream-dark">
                {item.image?.url ? <img src={item.image.url} alt={item.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-brown-light/50"><ImageOff size={26} /></div>}
              </div>
              <div className="p-3"><h2 className="line-clamp-1 font-display font-semibold text-brown-dark">{item.name}</h2><p className="mt-1 text-sm font-semibold text-accent">₹{item.salePrice ?? item.price}</p></div>
            </Link>
            <button onClick={() => toggleFavorite(item)} aria-label={`Remove ${item.name} from favorites`} className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brown-light shadow-card backdrop-blur hover:text-red-500"><Trash2 size={16} /></button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
