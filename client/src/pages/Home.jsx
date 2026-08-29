import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Flame, SearchX, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import FoodCard from "../components/FoodCard";
import FloatingFavButton from "../components/FloatingFavButton";
import EmptyState from "../components/EmptyState";
import { FoodGridSkeleton, ChipsSkeleton } from "../components/Skeletons";
import { fetchCategories, fetchMenu } from "../services/api";

const shuffleItems = (items) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
};

const getStableMenuOrder = (items) => {
  const orderKey = "gapshap_menu_order";
  const itemsById = new Map(items.map((item) => [item._id, item]));

  try {
    const storedOrder = JSON.parse(localStorage.getItem(orderKey) || "[]");
    const existingItems = storedOrder
      .map((itemId) => itemsById.get(itemId))
      .filter(Boolean);
    const knownIds = new Set(storedOrder);
    const newItems = shuffleItems(items.filter((item) => !knownIds.has(item._id)));
    const orderedItems = [...existingItems, ...newItems];

    localStorage.setItem(orderKey, JSON.stringify(orderedItems.map((item) => item._id)));
    return orderedItems;
  } catch {
    return shuffleItems(items);
  }
};

const HOME_STATE_KEY = "gapshap_home_state";
const INITIAL_VISIBLE_ITEMS = 12;
const LOAD_MORE_COUNT = 8;

const readHomeState = () => {
  try {
    return JSON.parse(localStorage.getItem(HOME_STATE_KEY) || "{}");
  } catch {
    return {};
  }
};

const Home = () => {
  const savedState = readHomeState();
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(savedState.search || "");
  const [activeCategory, setActiveCategory] = useState(savedState.activeCategory || null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_ITEMS);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    return () => {
      localStorage.setItem(
        HOME_STATE_KEY,
        JSON.stringify({ search, activeCategory, scrollY: window.scrollY })
      );
    };
  }, [search, activeCategory]);

  useEffect(() => {
    if (!loading && savedState.scrollY) {
      requestAnimationFrame(() => window.scrollTo({ top: savedState.scrollY, behavior: "instant" }));
    }
  }, [loading, savedState.scrollY]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_ITEMS);
  }, [search, activeCategory]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [catRes, menuRes] = await Promise.all([fetchCategories(), fetchMenu()]);
        setCategories(catRes.data.data);
        setItems(getStableMenuOrder(menuRes.data.data));
      } catch (err) {
        console.error("Failed to load menu:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const featured = useMemo(() => items.filter((i) => i.featured && i.available).slice(0, 8), [items]);

  const availableItemCounts = useMemo(() => {
    const counts = { all: 0 };
    items.forEach((item) => {
      if (!item.available) return;
      counts.all += 1;
      const categoryId = item.category?._id || item.category;
      if (categoryId) counts[categoryId] = (counts[categoryId] || 0) + 1;
    });
    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCategory ? item.category?._id === activeCategory : true;
      const matchesSearch = search
        ? item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, search]);

  const visibleItems = useMemo(
    () => filteredItems.slice(0, visibleCount),
    [filteredItems, visibleCount]
  );

  const hasMoreItems = visibleCount < filteredItems.length;

  useEffect(() => {
    if (!loadMoreRef.current || !hasMoreItems) return undefined;

    const node = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting) {
          setVisibleCount((count) => Math.min(count + LOAD_MORE_COUNT, filteredItems.length));
        }
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [filteredItems.length, hasMoreItems]);

  return (
    <div className="min-h-screen bg-cream pb-28">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 space-y-7">
        <section className="top-banner relative overflow-hidden rounded-[1.75rem] bg-brown-dark px-6 py-8 sm:px-10 sm:py-10 text-cream shadow-soft">
          <div className="top-banner-ring absolute -right-10 -top-16 h-56 w-56 rounded-full border-[22px] border-accent/30" />
          <div className="top-banner-ring absolute right-10 bottom-[-72px] h-40 w-40 rounded-full border-[16px] border-cream/10" />
          <div className="top-banner-glow absolute left-1/2 top-[-12rem] h-64 w-64 -translate-x-1/2 rounded-full" />
          <div className="relative max-w-xl">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent-light">
              <Sparkles size={14} /> Your table is waiting
            </p>
            <h1 className="font-display text-4xl leading-[0.98] sm:text-5xl font-semibold tracking-tight">
              Good food.<br /><em className="text-accent-light">Better gapshap.</em>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-cream/70">
              Welcome in. Explore the menu, add your picks to My Orders, then show your list at the counter.
            </p>
            <a href="#menu" className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2.5 text-xs font-bold text-brown-dark hover:bg-accent hover:text-white transition-colors">
              Explore the menu <ArrowDown size={15} />
            </a>
          </div>
        </section>

        <SearchBar value={search} onChange={setSearch} />

        {!search && (
          <>
            {loading ? (
              <ChipsSkeleton />
            ) : (
              featured.length > 0 && (
                <section>
                  <h2 className="font-display text-xl font-semibold text-brown-dark flex items-center gap-1.5 mb-3">
                    Most Loved <Flame size={18} className="text-accent" />
                  </h2>
                  <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
                    {featured.map((item) => (
                      <motion.div
                        key={item._id}
                        whileHover={{ y: -3 }}
                        className="shrink-0 w-40"
                      >
                        <FoodCard item={item} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              )
            )}
          </>
        )}

        <section id="menu" className="scroll-mt-24">
          {loading ? (
            <ChipsSkeleton />
          ) : (
            <CategoryTabs
              categories={categories}
              activeId={activeCategory}
              onSelect={setActiveCategory}
              itemCounts={availableItemCounts}
            />
          )}
        </section>

        <section>
          {loading ? (
            <FoodGridSkeleton count={6} />
          ) : filteredItems.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No dishes found"
              description="Try a different search term or browse another category."
            />
          ) : (
            <>
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {visibleItems.map((item) => (
                  <FoodCard key={item._id} item={item} />
                ))}
              </motion.div>

              {hasMoreItems && <div ref={loadMoreRef} className="mt-5 h-1" />}
            </>
          )}
        </section>
      </main>

      <FloatingFavButton />
    </div>
  );
};

export default Home;
