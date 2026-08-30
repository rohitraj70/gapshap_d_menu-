import { memo } from "react";
import { Plus, Minus, ImageOff } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { useFavorites } from "../context/FavoritesContext";

const FoodCard = memo(({ item }) => {
  const { orders, addToOrders, updateOrderQty } = useFavorites();
  const current = orders.find((f) => f.menuItemId === item._id || f._id === item._id);
  const priceOptions = item.variants?.length
    ? item.variants.map((variant) => ({
        price: variant.salePrice ?? variant.price,
        originalPrice: variant.price,
      }))
    : [{ price: item.salePrice ?? item.price, originalPrice: item.price }];
  const lowestPrice = priceOptions.reduce((lowest, option) =>
    Number(option.price) < Number(lowest.price) ? option : lowest
  );
  const startingPrice = lowestPrice.price;
  const hasDiscount = Number(lowestPrice.originalPrice) > Number(startingPrice);
  const discountPercent = hasDiscount
    ? Math.round(((lowestPrice.originalPrice - startingPrice) / lowestPrice.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative overflow-hidden rounded-[1.2rem] border border-[#f0dfd0] bg-[#fffaf7] shadow-[0_18px_34px_-24px_rgba(68,48,38,0.8)] transition-transform duration-200 hover:-translate-y-0.5 dark:border-[#453730] dark:bg-[#2a211d] ${
        !item.available ? "opacity-60" : ""
      }`}
    >
      <Link to={`/food/${item._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f5eadf] dark:bg-[#332821]">
          {item.image?.url ? (
            <img
              src={item.image.url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brown-light/50">
              <ImageOff size={28} />
            </div>
          )}
          {item.featured && (
            <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-1 text-[11px] font-bold text-white shadow-md">
              Most Loved ❤️
            </span>
          )}
          {!item.available && (
            <span className="absolute inset-x-0 bottom-0 bg-brown-dark/85 text-cream text-xs font-semibold text-center py-1.5">
              Unavailable
            </span>
          )}
        </div>
      </Link>

      <FavoriteButton item={item} className="absolute top-2 right-2" />

      <div className="p-3">
        <Link to={`/food/${item._id}`}>
          <h3 className="line-clamp-2 break-words font-display text-[0.95rem] font-semibold leading-snug text-brown-dark dark:text-[#fff8f0] sm:line-clamp-1 sm:text-[1rem]">
            {item.name}
          </h3>
          {item.description && (
            <p className="mt-0.5 line-clamp-2 text-[11px] text-brown-light dark:text-[#d7bba3] sm:text-xs">{item.description}</p>
          )}
          {item.variants?.length > 0 && (
            <p className="mt-1 line-clamp-1 text-[10px] text-brown-light dark:text-[#d7bba3] sm:text-[11px]">
              {item.variants.map((variant) => `${variant.label}: ₹${variant.salePrice ?? variant.price}`).join(" · ")}
            </p>
          )}
        </Link>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="min-w-0 font-semibold text-accent">
            {item.variants?.length > 1 && <span className="mr-1 text-xs text-brown-light dark:text-[#d7bba3]">From</span>}
            {hasDiscount && <span className="mr-1 text-xs font-medium text-brown-light line-through dark:text-[#d7bba3]">₹{lowestPrice.originalPrice}</span>}
            ₹{startingPrice}
            {hasDiscount && <span className="ml-1 text-[10px] font-bold text-green-600">{discountPercent}% off</span>}
          </span>

          {!item.available ? (
            <span className="text-xs text-brown-light dark:text-[#d7bba3]">Not available</span>
          ) : current ? (
            <div className="flex h-9 min-w-[5.5rem] shrink-0 items-center justify-between gap-1 rounded-full bg-[#f6efe7] px-1.5 py-1 dark:bg-[#352a25]">
              <button
                onClick={() => updateOrderQty(current._id, current.qty - 1)}
                aria-label="Decrease quantity"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-brown-dark shadow-sm hover:text-accent dark:bg-[#2b211c] dark:text-[#fff8f0]"
              >
                <Minus size={13} />
              </button>
              <span className="w-4 text-center text-sm font-semibold text-brown-dark dark:text-[#fff8f0]">{current.qty}</span>
              <button
                onClick={() => updateOrderQty(current._id, current.qty + 1)}
                aria-label="Increase quantity"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-brown-dark shadow-sm hover:text-accent dark:bg-[#2b211c] dark:text-[#fff8f0]"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : item.variants?.length > 1 ? (
            <Link
              to={`/food/${item._id}`}
              className="rounded-full bg-brown px-3 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-brown-dark"
            >
              Choose size
            </Link>
          ) : (
            <button
              onClick={() => addToOrders(item, 1)}
              className="flex items-center gap-1 rounded-full bg-brown px-3 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-brown-dark"
            >
              <Plus size={13} /> Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

FoodCard.displayName = "FoodCard";

export default FoodCard;
