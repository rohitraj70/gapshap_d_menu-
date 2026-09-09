import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, ImageOff, Minus, Plus, Sparkles } from "lucide-react";
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
  const shouldShowDealBadge = selectedVariant
    ? selectedVariant.salePrice != null && selectedVariant.salePrice < selectedVariant.price
    : item.salePrice != null && item.salePrice < item.price;

  return (
    <div className="min-h-screen bg-cream pb-6 sm:pb-32">
      <div className="relative mx-auto aspect-[4/3] w-full max-w-5xl overflow-hidden bg-cream-dark sm:aspect-[16/10] sm:rounded-b-[1.8rem] lg:aspect-[16/9] lg:rounded-[1.8rem] lg:mt-6 lg:shadow-soft">
        {item.image?.url ? (
          <img src={item.image.url} alt={item.name} className="h-full w-full object-cover object-center" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brown-light/50">
            <ImageOff size={40} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/80 via-brown-dark/10 to-transparent" />

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

      <div className="mx-auto max-w-3xl animate-fade-up px-4 pb-24 pt-6 sm:pb-32 sm:pt-8">
        <div className="rounded-[1.7rem] border border-brown/10 bg-white p-4 shadow-[0_22px_50px_-28px_rgba(68,48,38,0.45)] sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                {item.category?.name && (
                  <span className="inline-flex items-center rounded-full bg-cream-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brown-light">
                    {item.category.name}
                  </span>
                )}
                {shouldShowDealBadge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                    <Sparkles size={11} /> Deal
                  </span>
                )}
              </div>
              <h1 className="font-display text-2xl font-bold leading-tight text-brown-dark sm:text-[2rem]">{item.name}</h1>
            </div>

            <div className="text-right">
              {shouldShowDealBadge && (
                <div className="mb-1 text-xs font-semibold text-brown-light line-through">₹{originalPrice}</div>
              )}
              <div className="font-display text-2xl font-bold text-accent">₹{displayPrice}</div>
            </div>
          </div>

          {item.description && (
            <p className="mt-4 text-sm leading-6 text-brown-light">{item.description}</p>
          )}
        </div>

        {item.variants?.length > 0 && (
          <div className="mt-6 rounded-[1.7rem] border border-brown/10 bg-white p-4 shadow-[0_18px_32px_-26px_rgba(68,48,38,0.5)] sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brown-light">Select size</p>
                <h2 className="mt-1 text-base font-semibold text-brown-dark">Choose your portion</h2>
              </div>
              <div className="rounded-full bg-[#f7f0ea] px-2.5 py-1 text-[10px] font-semibold text-brown-light">
                {item.variants.length} options
              </div>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {item.variants.map((variant) => {
                const isSelected = selectedVariant?.label === variant.label;
                const variantPrice = variant.salePrice ?? variant.price;
                const hasVariantDiscount = variant.salePrice != null && variant.salePrice < variant.price;

                return (
                  <button
                    key={variant.label}
                    onClick={() => setSelectedVariant(variant)}
                    className={`group relative flex items-center justify-between rounded-2xl border p-3 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-accent bg-cream-dark shadow-[0_14px_28px_-20px_rgba(180,102,55,0.65)]"
                        : "border-brown/10 bg-[#fffaf7] hover:border-accent/60 hover:bg-[#fff9f5]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${isSelected ? "border-accent bg-accent text-white" : "border-brown/15 bg-white text-brown-dark"}`}>
                        {isSelected ? <Check size={12} /> : <span className="inline-block h-2 w-2 rounded-full bg-current" />}
                      </div>
                      <div className="min-w-0">
                        {hasVariantDiscount && (
                          <div className="text-[10px] font-semibold text-brown-light line-through">₹{variant.price}</div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display text-lg font-bold text-brown-dark">₹{variantPrice}</div>
                      {hasVariantDiscount && (
                        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">Save</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!item.available ? (
          <div className="mt-8 rounded-[1.3rem] bg-cream-dark px-4 py-3 text-center text-sm font-semibold text-brown-dark">
            Currently unavailable
          </div>
        ) : (
          <div className="sticky bottom-0 z-20 -mx-4 border-t border-brown/10 bg-white/90 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-soft backdrop-blur-md sm:fixed sm:inset-x-0 sm:mx-0 sm:p-4 sm:pb-4">
            <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-[1.2rem] bg-cream-dark p-2.5 sm:p-3">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-brown-light">Selected</div>
                <div className="truncate text-sm font-semibold text-brown-dark">
                  {selectedVariant?.label || "Standard"} · ₹{displayPrice}
                </div>
              </div>

              {current ? (
                <div className="flex items-center gap-3 rounded-full bg-white px-2 py-1.5 shadow-sm ring-1 ring-brown/10">
                  <button
                    onClick={() => updateOrderQty(current._id, current.qty - 1)}
                    aria-label="Decrease quantity"
                    className="details-control flex h-8 w-8 items-center justify-center rounded-full bg-[#f8f2ee] text-brown-dark hover:text-accent"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-brown-dark">{current.qty}</span>
                  <button
                    onClick={() => updateOrderQty(current._id, current.qty + 1)}
                    aria-label="Increase quantity"
                    className="details-control flex h-8 w-8 items-center justify-center rounded-full bg-[#f8f2ee] text-brown-dark hover:text-accent"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToOrders(currentSelection, 1)}
                  className="min-h-11 rounded-full bg-brown px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brown-dark"
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
