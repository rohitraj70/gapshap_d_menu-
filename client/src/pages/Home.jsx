import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const HOME_STATE_KEY = "gapshap_home_state";
const PAGE_SIZE = 12;

const normalizeSearchText = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildSearchTerms = (value = "") =>
  normalizeSearchText(value)
    .split(" ")
    .filter(Boolean);

const matchesItemSearch = (item, query) => {
  const terms = buildSearchTerms(query);
  if (terms.length === 0) return true;

  const searchableText = [
    item.name,
    item.description,
    item.category?.name,
    ...(item.variants || []).map((variant) => variant.label),
  ]
    .filter(Boolean)
    .join(" ");

  const normalizedText = normalizeSearchText(searchableText);
  return terms.every((term) => normalizedText.includes(term));
};

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState(savedState.search || "");
  const [activeCategory, setActiveCategory] = useState(savedState.activeCategory || null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categoriesReady, setCategoriesReady] = useState(false);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(
      HOME_STATE_KEY,
      JSON.stringify({ search, activeCategory, scrollY: window.scrollY })
    );
  }, [search, activeCategory]);

  useEffect(() => {
    if (!loading && savedState.scrollY) {
      requestAnimationFrame(() => window.scrollTo({ top: savedState.scrollY, behavior: "instant" }));
    }
  }, [loading, savedState.scrollY]);

  const loadMenuPage = useCallback(
    async (nextPage, { append = false } = {}) => {
      const params = { page: nextPage, limit: PAGE_SIZE };
      if (activeCategory) params.category = activeCategory;
      if (search) params.search = search;

      try {
        const { data } = await fetchMenu(params);
        const nextItems = Array.isArray(data?.data) ? data.data : [];

        setItems((prev) => (append ? [...prev, ...nextItems] : nextItems));
        setHasMore(Boolean(data?.hasMore ?? false));
        setPage(nextPage);
        return data;
      } catch (err) {
        console.error("Failed to load menu:", err);
        return null;
      }
    },
    [activeCategory, search]
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catRes = await fetchCategories();
        setCategories(catRes.data.data || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setCategoriesReady(true);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!categoriesReady) return;

    const reloadMenu = async () => {
      setLoading(true);
      setItems([]);
      setHasMore(true);
      await loadMenuPage(1, { append: false });
      setLoading(false);
    };

    reloadMenu();
  }, [categoriesReady, activeCategory, search, loadMenuPage]);

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
      const matchesSearch = matchesItemSearch(item, search);
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, search]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loading || loadingMore) return undefined;

    const node = loadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry?.isIntersecting) return;

        setLoadingMore(true);
        loadMenuPage(page + 1, { append: true }).finally(() => {
          setLoadingMore(false);
        });
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadMenuPage, page]);

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
                {filteredItems.map((item) => (
                  <FoodCard key={item._id} item={item} />
                ))}
              </motion.div>

              {hasMore && <div ref={loadMoreRef} className="mt-5 h-1" />}
              {loadingMore && <div className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-brown-light">Loading more…</div>}
            </>
          )}
        </section>
      </main>

      <FloatingFavButton />
    </div>
  );
};

export default Home;
