import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Minus, Plus, Trash2, HeartOff, Bell, CheckCircle2 } from "lucide-react";
import EmptyState from "../components/EmptyState";
import { useFavorites } from "../context/FavoritesContext";

const Favorites = () => {
  const { orders, updateOrderQty, removeFromOrders, totalAmount, clearOrders } = useFavorites();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="collection-header max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Go back" className="collection-back">
            <ArrowLeft size={22} />
          </button>
          <h1 className="collection-title font-display text-lg font-semibold">My Orders</h1>
        </div>
        <EmptyState
          icon={HeartOff}
          title="No orders yet"
          description="Browse the menu, add your favorites to this list, and show it at the counter when you are ready."
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
      <div className="collection-header sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-brown/10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Go back" className="collection-back">
            <ArrowLeft size={22} />
          </button>
          <h1 className="collection-title font-display text-lg font-semibold flex-1">My Orders</h1>
          <button
            onClick={clearOrders}
            className="collection-clear text-xs font-semibold hover:text-accent transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-4">
        <div className="rounded-xl2 border border-accent/20 bg-accent/10 p-4">
          <p className="font-display font-semibold text-brown-dark">A little note for you</p>
          <p className="mt-1 text-sm leading-5 text-brown-light">Make any changes here, then show this order list to our cashier. We will take care of the rest.</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-4 pb-40">
        <div className="max-h-[calc(100vh-230px)] overflow-y-auto overscroll-contain pr-1 space-y-3">
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
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-brown/10 p-4 shadow-soft">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-brown-light">Estimated Total</span>
            <span className="font-display text-xl font-bold text-brown-dark">₹{totalAmount}</span>
          </div>

          {!showConfirm ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full bg-accent text-white font-semibold py-3.5 rounded-full hover:bg-accent-dark transition-colors flex items-center justify-center gap-2"
              >
                <Bell size={18} /> Show at Counter
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-brown-dark text-white font-semibold py-3.5 rounded-full hover:bg-brown transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> Place Order
              </button>
            </div>
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

          <button
            onClick={() => navigate("/order-history")}
            className="w-full border border-brown/10 bg-white text-brown-dark font-semibold py-3 rounded-full hover:bg-cream transition-colors"
          >
            View order history
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
