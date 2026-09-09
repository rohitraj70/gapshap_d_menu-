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
      className={`details-control flex h-9 w-9 items-center justify-center rounded-full bg-[#f8eee3]/90 text-[#2b211c] shadow-card backdrop-blur transition-colors dark:bg-[#2b211c]/90 dark:text-[#fff8f0] ${className}`}
    >
      <Heart
        size={size}
        strokeWidth={2}
        className={active ? "fill-accent text-accent" : "text-current"}
      />
    </motion.button>
  );
};

export default FavoriteButton;
