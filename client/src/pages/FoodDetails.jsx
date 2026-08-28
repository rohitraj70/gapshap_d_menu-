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
  const { favorites, addToFavorites, updateQty } = useFavorites();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await fetchMenuItem(id);
        setItem(data.data);
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

  const current = favorites.find((f) => f._id === item._id);

  return (
    <div className="min-h-screen bg-cream pb-28">
      <div className="relative aspect-square bg-cream-dark">
        {item.image?.url ? (
          <img src={item.image.url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brown-light/50">
            <ImageOff size={40} />
          </div>
        )}
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-card flex items-center justify-center text-brown-dark"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="absolute top-4 right-4">
          <FavoriteButton item={item} size={20} />
        </div>
        {item.featured && (
          <span className="absolute bottom-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
            Most Loved ❤️
          </span>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-5">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-brown-dark">{item.name}</h1>
          <span className="font-display text-xl font-bold text-accent shrink-0">
            {item.salePrice != null && (
              <span className="text-sm text-brown-light line-through mr-1">₹{item.price}</span>
            )}
            ₹{item.salePrice ?? item.price}
          </span>
        </div>
        {item.category?.name && (
          <span className="inline-block mt-2 text-xs font-semibold text-brown-light bg-cream-dark px-2.5 py-1 rounded-full">
            {item.category.name}
          </span>
        )}
        {item.description && (
          <p className="text-sm text-brown-light leading-relaxed mt-4">{item.description}</p>
        )}

        {!item.available ? (
          <div className="mt-8 bg-cream-dark text-brown-dark text-sm font-semibold text-center py-3 rounded-xl2">
            Currently unavailable
          </div>
        ) : (
          <div className="fixed bottom-0 inset-x-0 bg-white border-t border-brown/10 p-4 shadow-soft">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              {current ? (
                <div className="flex items-center gap-4 bg-cream-dark rounded-full px-4 py-2.5 flex-1 justify-center">
                  <button
                    onClick={() => updateQty(item._id, current.qty - 1)}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-brown-dark hover:text-accent"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold w-6 text-center">{current.qty}</span>
                  <button
                    onClick={() => updateQty(item._id, current.qty + 1)}
                    aria-label="Increase quantity"
                    className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-brown-dark hover:text-accent"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToFavorites(item, 1)}
                  className="flex-1 bg-brown text-cream font-semibold py-3 rounded-full hover:bg-brown-dark transition-colors"
                >
                  Add to Favorites
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
