import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "gapshap_favorites";
const getSelectionId = (item) => `${item._id}:${item.variantLabel || "default"}`;

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (itemId) => favorites.some((f) => f.menuItemId === itemId || f._id === itemId),
    [favorites]
  );

  const addToFavorites = useCallback((item, qty = 1) => {
    setFavorites((prev) => {
      const selectionId = getSelectionId(item);
      const existing = prev.find((f) => f._id === selectionId);
      if (existing) {
        return prev.map((f) => (f._id === selectionId ? { ...f, qty: f.qty + qty } : f));
      }
      return [
        ...prev,
        {
          _id: selectionId,
          menuItemId: item._id,
          name: item.name,
          variantLabel: item.variantLabel || "",
          price: item.selectedPrice ?? item.salePrice ?? item.price,
          originalPrice: item.selectedPrice != null ? item.selectedOriginalPrice : item.price,
          image: item.image,
          qty,
        },
      ];
    });
  }, []);

  const removeFromFavorites = useCallback((itemId) => {
    setFavorites((prev) => prev.filter((f) => f._id !== itemId && f.menuItemId !== itemId));
  }, []);

  const toggleFavorite = useCallback(
    (item) => {
      if (isFavorite(item._id)) {
        removeFromFavorites(item._id);
      } else {
        addToFavorites(item, 1);
      }
    },
    [isFavorite, addToFavorites, removeFromFavorites]
  );

  const updateQty = useCallback((itemId, qty) => {
    setFavorites((prev) => {
      if (qty <= 0) return prev.filter((f) => f._id !== itemId);
      return prev.map((f) => (f._id === itemId ? { ...f, qty } : f));
    });
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const totalCount = useMemo(() => favorites.reduce((sum, f) => sum + f.qty, 0), [favorites]);
  const totalAmount = useMemo(
    () => favorites.reduce((sum, f) => sum + f.qty * f.price, 0),
    [favorites]
  );

  const value = {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    updateQty,
    clearFavorites,
    totalCount,
    totalAmount,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};
