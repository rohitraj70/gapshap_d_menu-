import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flame, SearchX } from "lucide-react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import FoodCard from "../components/FoodCard";
import FloatingFavButton from "../components/FloatingFavButton";
import EmptyState from "../components/EmptyState";
import { FoodGridSkeleton, ChipsSkeleton } from "../components/Skeletons";
import { fetchCategories, fetchMenu } from "../services/api";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [catRes, menuRes] = await Promise.all([fetchCategories(), fetchMenu()]);
        setCategories(catRes.data.data);
        setItems(menuRes.data.data);
      } catch (err) {
        console.error("Failed to load menu:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const featured = useMemo(() => items.filter((i) => i.featured && i.available), [items]);

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

  return (
    <div className="min-h-screen bg-cream pb-28">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-5">
        <SearchBar value={search} onChange={setSearch} />

        {!search && (
          <>
            {loading ? (
              <ChipsSkeleton />
            ) : (
              featured.length > 0 && (
                <section>
                  <h2 className="font-display text-lg font-semibold text-brown-dark flex items-center gap-1.5 mb-3">
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

        <section>
          {loading ? (
            <ChipsSkeleton />
          ) : (
            <CategoryTabs
              categories={categories}
              activeId={activeCategory}
              onSelect={setActiveCategory}
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
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredItems.map((item) => (
                <FoodCard key={item._id} item={item} />
              ))}
            </motion.div>
          )}
        </section>
      </div>

      <FloatingFavButton />
    </div>
  );
};

export default Home;
