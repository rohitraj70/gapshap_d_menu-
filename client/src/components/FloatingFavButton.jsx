import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

const FloatingFavButton = () => {
  const { totalCount, totalAmount } = useFavorites();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {totalCount > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          onClick={() => navigate("/orders")}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-brown text-cream rounded-full shadow-soft px-5 py-3 flex items-center gap-3 max-w-[92vw]"
        >
          <span className="relative">
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
              {totalCount}
            </span>
          </span>
          <span className="text-sm font-semibold">My Orders</span>
          <span className="text-sm font-bold text-accent-light">₹{totalAmount}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingFavButton;
