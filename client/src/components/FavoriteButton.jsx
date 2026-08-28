import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";

const FavoriteButton = ({ item, size = 18, className = "" }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(item._id);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(item);
      }}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      className={`details-control w-9 h-9 rounded-full flex items-center justify-center bg-white/90 backdrop-blur shadow-card transition-colors ${className}`}
    >
      <Heart
        size={size}
        strokeWidth={2}
        className={active ? "fill-accent text-accent" : "text-brown-light"}
      />
    </motion.button>
  );
};

export default FavoriteButton;
