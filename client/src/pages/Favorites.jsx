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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(230,126,34,0.09),_transparent_28%),linear-gradient(180deg,#fdf9f5_0%,#f7efe7_100%)] pb-[12.5rem] sm:pb-32">
      <div className="collection-header sticky top-0 z-20 border-b border-brown/10 bg-[#fffaf5]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-3.5 flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Go back" className="collection-back rounded-full bg-white p-2.5 shadow-[0_12px_24px_-16px_rgba(111,78,55,0.7)] ring-1 ring-[#f1dfce]">
            <ArrowLeft size={18} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="collection-title font-display text-lg font-semibold tracking-tight">My Orders</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brown-light">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
          </div>

          <button
            onClick={clearOrders}
            className="collection-clear text-[10px] font-semibold uppercase tracking-[0.14em] text-brown-light hover:text-accent transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-3.5 pt-4 sm:px-4">
        <div className="rounded-[1.8rem] border border-[#f1d7bb] bg-gradient-to-br from-[#fffaf4] via-[#fff] to-[#fff3e7] p-3.5 shadow-[0_24px_48px_-28px_rgba(111,78,55,0.7)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brown-light">Order summary</p>
              <p className="mt-1 font-display text-lg font-semibold text-brown-dark">Ready to place?</p>
            </div>
            <div className="rounded-full border border-[#f0d2a3] bg-white/80 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brown-dark shadow-sm">
              {orders.length} dishes
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-3.5 pt-4 sm:px-4">
        <div className="rounded-[2rem] border border-[#f1dfce] bg-white/85 p-2.5 shadow-[0_28px_50px_-30px_rgba(40,25,20,0.65)] backdrop-blur-sm dark:bg-[#2b211c]/90 dark:border-[#4f3b30]">
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brown-light dark:text-[#f3d7b9]">Selected items</p>
            <div className="flex items-center gap-1.5 rounded-full bg-[#f7efe8] px-2 py-1 dark:bg-[#3a2a22]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-brown-dark dark:text-[#fff8f0]">{totalItems} qty</span>
            </div>
          </div>

          <div className="scroll-panel max-h-[46vh] min-h-[220px] overflow-y-auto overscroll-contain px-2 pb-2 pt-1 space-y-3">
            <AnimatePresence initial={false}>
              {orders.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  className="rounded-[1.35rem] border border-[#f2e3d5] bg-gradient-to-br from-white via-[#fffdfb] to-[#fff7f0] p-3 shadow-[0_14px_28px_-22px_rgba(68,48,38,0.75)] transition-all duration-200 hover:-translate-y-0.5 dark:border-[#4f3b30] dark:from-[#312922] dark:via-[#312922] dark:to-[#2c231f]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[1.1rem] bg-[#f4e9dc] ring-1 ring-[#f2dcc1] dark:bg-[#43352d] dark:ring-[#5b4032]">
                      {item.image?.url && (
                        <img src={item.image.url} alt={item.name} className="h-full w-full object-cover" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-1 text-sm font-semibold text-brown-dark dark:text-[#fff8f0]">{item.name}</h3>
                          {item.variantLabel && (
                            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent">{item.variantLabel}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-[0.12em] text-brown-light">Total</p>
                          <p className="text-sm font-semibold text-brown-dark dark:text-[#fff8f0]">₹{item.qty * item.price}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#f6efe7] px-1.5 py-1 shadow-inner dark:bg-[#43352d]">
                          <button
                            onClick={() => updateOrderQty(item._id, item.qty - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brown-dark transition-colors hover:text-accent dark:bg-[#2b211c] dark:text-[#fff8f0]"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-4 text-center text-sm font-semibold text-brown-dark dark:text-[#fff8f0]">{item.qty}</span>
                          <button
                            onClick={() => updateOrderQty(item._id, item.qty + 1)}
                            aria-label="Increase quantity"
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brown-dark transition-colors hover:text-accent dark:bg-[#2b211c] dark:text-[#fff8f0]"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromOrders(item._id)}
                          aria-label={`Remove ${item.name}`}
                          className="inline-flex items-center gap-1 rounded-full border border-[#eedec7] bg-white px-2 py-1 text-[10px] font-medium text-brown-light transition-colors hover:border-red-200 hover:text-red-500 dark:border-[#5b4032] dark:bg-[#2b211c] dark:text-[#f3d7b9]"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>

                      <p className="mt-2 text-[11px] text-brown-light dark:text-[#f3d7b9]">
                        {item.originalPrice != null && item.originalPrice !== item.price && (
                          <span className="mr-1 line-through">₹{item.originalPrice}</span>
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

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brown/10 bg-white/95 shadow-[0_-16px_34px_-20px_rgba(0,0,0,0.24)] backdrop-blur-xl dark:bg-[#2b211c]/95">
        <div className="mx-auto max-w-3xl px-3.5 py-3 sm:px-4">
          <div className="rounded-[1.5rem] border border-[#f2d9b6] bg-gradient-to-r from-[#fef5ea] to-[#f4eadf] px-3.5 py-2.5 dark:border-[#5b4032] dark:from-[#3a2a22] dark:to-[#312922]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brown-light dark:text-[#f3d7b9]">Estimated total</p>
                <p className="font-display text-[1.9rem] font-bold leading-none text-brown-dark dark:text-[#fff8f0]">₹{totalAmount}</p>
              </div>
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brown-dark shadow-sm dark:bg-[#2b211c] dark:text-[#fff8f0]">
                {totalItems} items
              </span>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2">
            <button
              onClick={() => navigate("/checkout")}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brown-dark px-3 py-2.75 text-[11px] font-semibold text-white shadow-[0_12px_18px_-12px_rgba(111,78,55,0.9)] transition-colors hover:bg-brown"
            >
              <CheckCircle2 size={16} /> Place Order
            </button>

            <button
              onClick={() => navigate("/order-history")}
              className="w-full rounded-full border border-[#eddfd0] bg-white px-3 py-2.5 text-[11px] font-semibold text-brown-dark transition-colors hover:bg-cream dark:border-[#5b4032] dark:bg-[#2b211c] dark:text-[#fff8f0]"
            >
              View order history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
