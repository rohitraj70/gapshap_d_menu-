import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ImageOff, Minus, Plus } from "lucide-react";
import FavoriteButton from "../components/FavoriteButton";
import EmptyState from "../components/EmptyState";
import { fetchMenuItem } from "../services/api";
import { useFavorites } from "../context/FavoritesContext";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { orders, addToOrders, updateOrderQty } = useFavorites();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchMenuItem(id);
        setItem(data.data);
        setSelectedVariant(data.data.variants?.[0] || null);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="aspect-square skeleton animate-shimmer" />
        <div className="p-4 space-y-3">
          <div className="h-6 w-2/3 rounded skeleton animate-shimmer" />
          <div className="h-4 w-full rounded skeleton animate-shimmer" />
        </div>
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <button onClick={() => navigate(-1)} className="p-4 text-brown-dark self-start">
          <ArrowLeft size={22} />
        </button>
        <EmptyState
          title="Dish not found"
          description="This item may have been removed from the menu."
          action={
            <Link to="/" className="text-accent font-semibold text-sm">
              Back to menu
            </Link>
          }
        />
      </div>
    );
  }

  const currentSelection = selectedVariant
    ? { ...item, variantLabel: selectedVariant.label, selectedPrice: selectedVariant.salePrice ?? selectedVariant.price, selectedOriginalPrice: selectedVariant.price }
    : item;
  const current = orders.find((f) => f.menuItemId === item._id && (f.variantLabel || "") === (selectedVariant?.label || ""))
    || (!selectedVariant ? orders.find((f) => f._id === item._id) : null);
  const displayPrice = selectedVariant?.salePrice ?? selectedVariant?.price ?? item.salePrice ?? item.price;
  const originalPrice = selectedVariant?.price ?? item.price;

  return (
    <div className="min-h-screen bg-cream pb-6 sm:pb-32">
      <div className="relative mx-auto aspect-[4/3] w-full max-w-5xl overflow-hidden bg-cream-dark sm:aspect-[16/10] sm:rounded-b-xl2 lg:aspect-[16/9] lg:rounded-xl2 lg:mt-6 lg:shadow-soft">
        {item.image?.url ? (
          <img src={item.image.url} alt={item.name} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brown-light/50">
            <ImageOff size={40} />
          </div>
        )}
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="details-control absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brown-dark shadow-card backdrop-blur sm:left-6 sm:top-6"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <FavoriteButton item={item} size={20} />
        </div>
        {item.featured && (
          <span className="absolute bottom-4 left-4 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-white shadow sm:bottom-6 sm:left-6">
            Most Loved ❤️
          </span>
        )}
      </div>

      <div className="mx-auto max-w-3xl animate-fade-up px-4 pb-6 pt-6 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-brown-dark">{item.name}</h1>
          <span className="font-display text-xl font-bold text-accent shrink-0">
            {displayPrice !== originalPrice && (
              <span className="text-sm text-brown-light line-through mr-1">₹{originalPrice}</span>
            )}
            ₹{displayPrice}
          </span>
        </div>
        {item.category?.name && (
          <span className="inline-block mt-2 text-xs font-semibold text-brown-light bg-cream-dark px-2.5 py-1 rounded-full">
            {item.category.name}
          </span>
        )}
        {item.variants?.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-brown-dark mb-2">Choose size</p>
            <div className="flex flex-wrap gap-2">
              {item.variants.map((variant) => (
                <button
                  key={variant.label}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                    selectedVariant?.label === variant.label
                      ? "bg-accent text-white border-accent"
                      : "bg-white text-brown-dark border-brown/15 hover:border-accent"
                  }`}
                >
                  {variant.label} · ₹{variant.salePrice ?? variant.price}
                </button>
              ))}
            </div>
          </div>
        )}
        {item.description && (
          <p className="text-sm text-brown-light leading-relaxed mt-5">{item.description}</p>
        )}

        {!item.available ? (
          <div className="mt-8 bg-cream-dark text-brown-dark text-sm font-semibold text-center py-3 rounded-xl2">
            Currently unavailable
          </div>
        ) : (
          <div className="sticky bottom-0 z-20 -mx-4 border-t border-brown/10 bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-soft backdrop-blur-md sm:fixed sm:inset-x-0 sm:mx-0 sm:p-4 sm:pb-4">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              {current ? (
                <div className="flex min-h-12 items-center gap-4 bg-cream-dark rounded-full px-4 py-2.5 flex-1 justify-center">
                  <button
                    onClick={() => updateOrderQty(current._id, current.qty - 1)}
                    aria-label="Decrease quantity"
                    className="details-control flex h-8 w-8 items-center justify-center rounded-full bg-white text-brown-dark shadow hover:text-accent"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold w-6 text-center">{current.qty}</span>
                  <button
                    onClick={() => updateOrderQty(current._id, current.qty + 1)}
                    aria-label="Increase quantity"
                    className="details-control flex h-8 w-8 items-center justify-center rounded-full bg-white text-brown-dark shadow hover:text-accent"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToOrders(currentSelection, 1)}
                  className="flex-1 min-h-12 bg-brown text-cream font-semibold py-3 rounded-full hover:bg-brown-dark transition-colors"
                >
                  Add to My Orders
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetails;
