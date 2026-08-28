import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

const FavoritesContext = createContext(null);
const FAVORITES_KEY = "gapshap_favorites";
const ORDERS_KEY = "gapshap_orders";
const getSelectionId = (item) => `${item._id}:${item.variantLabel || "default"}`;
const readStored = (key, fallback = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => readStored(FAVORITES_KEY));
  const [orders, setOrders] = useState(() => readStored(ORDERS_KEY, readStored(FAVORITES_KEY)));

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const isFavorite = useCallback(
    (itemId) => favorites.some((f) => f.menuItemId === itemId || f._id === itemId),
    [favorites]
  );

  const addToOrders = useCallback((item, qty = 1) => {
    setOrders((prev) => {
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

  const removeFromOrders = useCallback((itemId) => {
    setOrders((prev) => prev.filter((f) => f._id !== itemId && f.menuItemId !== itemId));
  }, []);

  const toggleFavorite = useCallback(
    (item) => {
      if (isFavorite(item._id)) {
        setFavorites((prev) => prev.filter((f) => f._id !== item._id));
      } else {
        setFavorites((prev) => [...prev, item]);
      }
    },
    [isFavorite]
  );

  const updateOrderQty = useCallback((itemId, qty) => {
    setOrders((prev) => {
      if (qty <= 0) return prev.filter((f) => f._id !== itemId);
      return prev.map((f) => (f._id === itemId ? { ...f, qty } : f));
    });
  }, []);

  const clearOrders = useCallback(() => setOrders([]), []);

  const totalCount = useMemo(() => orders.reduce((sum, f) => sum + f.qty, 0), [orders]);
  const totalAmount = useMemo(
    () => orders.reduce((sum, f) => sum + f.qty * f.price, 0),
    [orders]
  );

  const value = {
    favorites,
    orders,
    isFavorite,
    addToOrders,
    removeFromOrders,
    toggleFavorite,
    updateOrderQty,
    clearOrders,
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
