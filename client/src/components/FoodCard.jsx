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
      className={`group relative bg-white rounded-xl2 shadow-card overflow-hidden border border-brown/5 ${
        !item.available ? "opacity-60" : ""
      }`}
    >
      <Link to={`/food/${item._id}`} className="block">
        <div className="relative aspect-[4/3] bg-cream-dark overflow-hidden">
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
            <span className="absolute top-2 left-2 bg-accent text-white text-[11px] font-bold px-2 py-1 rounded-full shadow">
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
          <h3 className="font-display font-semibold text-brown-dark leading-snug text-[0.95rem] sm:text-[1rem] break-words line-clamp-2 sm:line-clamp-1">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-[11px] sm:text-xs text-brown-light mt-0.5 line-clamp-2">{item.description}</p>
          )}
          {item.variants?.length > 0 && (
            <p className="text-[10px] sm:text-[11px] text-brown-light mt-1 line-clamp-1">
              {item.variants.map((variant) => `${variant.label}: ₹${variant.salePrice ?? variant.price}`).join(" · ")}
            </p>
          )}
        </Link>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="min-w-0 font-semibold text-accent">
            {item.variants?.length > 1 && <span className="text-xs text-brown-light mr-1">From</span>}
            {hasDiscount && <span className="mr-1 text-xs font-medium text-brown-light line-through">₹{lowestPrice.originalPrice}</span>}
            ₹{startingPrice}
            {hasDiscount && <span className="ml-1 text-[10px] font-bold text-green-600">{discountPercent}% off</span>}
          </span>

          {!item.available ? (
            <span className="text-xs text-brown-light">Not available</span>
          ) : current ? (
            <div className="flex h-9 min-w-[5.5rem] shrink-0 items-center justify-between gap-1 rounded-full bg-cream-dark px-1.5 py-1">
              <button
                onClick={() => updateOrderQty(current._id, current.qty - 1)}
                aria-label="Decrease quantity"
                className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-brown-dark hover:text-accent"
              >
                <Minus size={13} />
              </button>
              <span className="text-sm font-semibold w-4 text-center">{current.qty}</span>
              <button
                onClick={() => updateOrderQty(current._id, current.qty + 1)}
                aria-label="Increase quantity"
                className="w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-brown-dark hover:text-accent"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : item.variants?.length > 1 ? (
            <Link
              to={`/food/${item._id}`}
              className="bg-brown text-cream text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brown-dark transition-colors"
            >
              Choose size
            </Link>
          ) : (
            <button
              onClick={() => addToOrders(item, 1)}
              className="flex items-center gap-1 bg-brown text-cream text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brown-dark transition-colors"
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
