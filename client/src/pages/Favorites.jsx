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
  const totalItems = orders.reduce((sum, item) => sum + item.qty, 0);

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
    <div className="min-h-screen bg-cream pb-[calc(13rem+env(safe-area-inset-bottom))]">
      <div className="collection-header sticky top-0 z-20 bg-cream/95 backdrop-blur border-b border-brown/10">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Go back" className="collection-back rounded-full bg-white/70 p-2.5 shadow-sm ring-1 ring-brown/5">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h1 className="collection-title font-display text-lg font-semibold">My Orders</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brown-light">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={clearOrders}
            className="collection-clear text-[10px] font-semibold uppercase tracking-[0.14em] hover:text-accent transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-4">
        <div className="rounded-[1.5rem] border border-accent/20 bg-gradient-to-r from-accent/10 via-amber-50 to-orange-50 p-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display font-semibold text-brown-dark text-base">Ready to order?</p>
              <p className="mt-1 text-[12px] leading-5 text-brown-light">Review items, adjust quantities, and show it to the cashier when you’re ready.</p>
            </div>
            <div className="rounded-full bg-white/80 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brown-dark shadow-sm">
              {orders.length} dishes
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-4">
        <div className="rounded-[1.5rem] border border-brown/10 bg-white/85 shadow-card backdrop-blur-sm dark:bg-[#2b211c]/90">
          <div className="flex items-center justify-between border-b border-brown/10 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brown-light dark:text-[#f3d7b9]">Selected items</p>
            <span className="rounded-full bg-cream-dark dark:bg-[#3a2a22] px-2 py-1 text-[10px] font-semibold text-brown-dark dark:text-[#fff8f0]">{totalItems} qty</span>
          </div>

          <div className="scroll-panel max-h-[min(42vh,420px)] min-h-[200px] overflow-y-auto overscroll-contain p-3 space-y-3">
            <AnimatePresence initial={false}>
              {orders.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  className="group rounded-[1.2rem] border border-brown/5 bg-white dark:bg-[#312922] p-3 shadow-[0_10px_18px_-18px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-cream-dark overflow-hidden shrink-0 ring-1 ring-brown/5">
                      {item.image?.url && (
                        <img src={item.image.url} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-brown-dark dark:text-[#fff8f0] text-sm line-clamp-1">{item.name}</h3>
                          {item.variantLabel && (
                            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent">{item.variantLabel}</p>
                          )}
                        </div>
                        <span className="font-semibold text-brown-dark dark:text-[#fff8f0] text-sm whitespace-nowrap">₹{item.qty * item.price}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => updateOrderQty(item._id, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 rounded-full bg-cream-dark dark:bg-[#43352d] flex items-center justify-center text-brown-dark dark:text-[#fff8f0] hover:text-accent transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center dark:text-[#fff8f0]">{item.qty}</span>
                          <button
                            onClick={() => updateOrderQty(item._id, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 rounded-full bg-cream-dark dark:bg-[#43352d] flex items-center justify-center text-brown-dark dark:text-[#fff8f0] hover:text-accent transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromOrders(item._id)}
                          aria-label={`Remove ${item.name}`}
                          className="inline-flex items-center gap-1 rounded-full border border-brown/10 bg-white dark:bg-[#2b211c] px-2 py-1 text-[10px] font-medium text-brown-light dark:text-[#f3d7b9] hover:border-red-200 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>

                      <p className="mt-2 text-[11px] text-brown-light dark:text-[#f3d7b9]">
                        {item.originalPrice != null && item.originalPrice !== item.price && (
                          <span className="line-through mr-1">₹{item.originalPrice}</span>
                        )}
                        ₹{item.price} each
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-brown/10 bg-white/95 dark:bg-[#2b211c]/95 backdrop-blur-lg shadow-[0_-12px_32px_rgba(0,0,0,0.10)]">
        <div className="max-w-3xl mx-auto px-4 py-3 space-y-2.5">
          <div className="flex items-center justify-between rounded-[1.2rem] bg-amber-50/90 dark:bg-[#3a2a22] px-3.5 py-2.5 border border-amber-200/70 dark:border-[#5b4032]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brown-light dark:text-[#f3d7b9]">Estimated total</span>
            <span className="font-display text-[1.7rem] leading-none font-bold text-brown-dark dark:text-[#fff8f0]">₹{totalAmount}</span>
          </div>

          {!showConfirm ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full bg-accent text-white font-semibold py-2.75 rounded-full hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 shadow-sm text-[11px] sm:text-sm"
              >
                <Bell size={16} className="sm:w-[18px] sm:h-[18px]" /> Show at Counter
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-brown-dark text-white font-semibold py-2.75 rounded-full hover:bg-brown transition-colors flex items-center justify-center gap-2 shadow-sm text-[11px] sm:text-sm"
              >
                <CheckCircle2 size={16} className="sm:w-[18px] sm:h-[18px]" /> Place Order
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-cream-dark dark:bg-[#342821] rounded-2xl p-4 text-center border border-brown/5"
            >
              <p className="font-display font-semibold text-brown-dark dark:text-[#fff8f0]">Show this screen to the cashier</p>
              <p className="text-[11px] text-brown-light dark:text-[#f3d7b9] mt-1">They’ll confirm your order and take payment at the counter.</p>
              <button
                onClick={() => setShowConfirm(false)}
                className="mt-3 text-[11px] font-semibold text-accent"
              >
                Keep editing selection
              </button>
            </motion.div>
          )}

          <button
            onClick={() => navigate("/order-history")}
            className="w-full border border-brown/10 bg-white dark:bg-[#2b211c] text-brown-dark dark:text-[#fff8f0] font-semibold py-2.5 rounded-full hover:bg-cream transition-colors text-[11px] sm:text-sm"
          >
            View order history
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
