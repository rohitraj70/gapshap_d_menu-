import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Minus, Plus, Trash2, HeartOff, Bell } from "lucide-react";
import EmptyState from "../components/EmptyState";
import { useFavorites } from "../context/FavoritesContext";

const Favorites = () => {
  const { orders, updateOrderQty, removeFromOrders, totalAmount, clearOrders } = useFavorites();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Go back" className="text-brown-dark">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-display text-lg font-semibold text-brown-dark">My Orders</h1>
        </div>
        <EmptyState
          icon={HeartOff}
          title="No orders yet"
          description="Browse the menu and add dishes you would like to order."
          action={
            <Link to="/" className="text-accent font-semibold text-sm">
              Browse the menu
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-40">
      <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-brown/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Go back" className="text-brown-dark">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-display text-lg font-semibold text-brown-dark flex-1">My Orders</h1>
          <button
            onClick={clearOrders}
            className="text-xs font-semibold text-brown-light hover:text-accent transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-3">
        <AnimatePresence initial={false}>
          {orders.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-xl2 shadow-card p-3 flex items-center gap-3"
            >
              <div className="w-16 h-16 rounded-lg bg-cream-dark overflow-hidden shrink-0">
                {item.image?.url && (
                  <img src={item.image.url} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-brown-dark text-sm line-clamp-1">{item.name}</h3>
                {item.variantLabel && (
                  <p className="text-xs font-semibold text-accent mt-0.5">{item.variantLabel}</p>
                )}
                <p className="text-xs text-brown-light mt-0.5">
                  {item.originalPrice != null && item.originalPrice !== item.price && (
                    <span className="line-through mr-1">₹{item.originalPrice}</span>
                  )}
                  ₹{item.price} each
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => updateOrderQty(item._id, item.qty - 1)}
                    aria-label="Decrease quantity"
                    className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center text-brown-dark hover:text-accent"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateOrderQty(item._id, item.qty + 1)}
                    aria-label="Increase quantity"
                    className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center text-brown-dark hover:text-accent"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-semibold text-brown-dark text-sm">₹{item.qty * item.price}</span>
                <button
                  onClick={() => removeFromOrders(item._id)}
                  aria-label={`Remove ${item.name}`}
                  className="text-brown-light hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-brown/10 p-4 shadow-soft">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brown-light">Estimated Total</span>
            <span className="font-display text-xl font-bold text-brown-dark">₹{totalAmount}</span>
          </div>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-accent text-white font-semibold py-3.5 rounded-full hover:bg-accent-dark transition-colors flex items-center justify-center gap-2"
            >
              <Bell size={18} /> Show at Counter
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream-dark rounded-xl2 p-4 text-center"
            >
              <p className="font-display font-semibold text-brown-dark">
                Show this screen to the cashier
              </p>
              <p className="text-xs text-brown-light mt-1">
                They'll confirm your order and take payment at the counter.
              </p>
              <button
                onClick={() => setShowConfirm(false)}
                className="mt-3 text-xs font-semibold text-accent"
              >
                Keep editing selection
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
