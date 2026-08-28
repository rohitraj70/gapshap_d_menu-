import { useEffect, useState } from "react";
import { Tags, UtensilsCrossed, Heart, CheckCircle2 } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import { fetchCategories, fetchMenu } from "../../services/api";

const StatCard = ({ icon: Icon, label, value, tint }) => (
  <div className="bg-white rounded-xl2 shadow-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tint}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-2xl font-display font-bold text-brown-dark">{value}</p>
      <p className="text-xs text-brown-light">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ categories: 0, items: 0, featured: 0, available: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, menuRes] = await Promise.all([fetchCategories(), fetchMenu()]);
        const items = menuRes.data.data;
        setStats({
          categories: catRes.data.count,
          items: items.length,
          featured: items.filter((i) => i.featured).length,
          available: items.filter((i) => i.available).length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-4 sm:p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold text-brown-dark mb-1">Dashboard</h1>
        <p className="text-sm text-brown-light mb-6">Overview of your menu at a glance.</p>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl2 skeleton animate-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Tags}
              label="Total Categories"
              value={stats.categories}
              tint="bg-accent/15 text-accent"
            />
            <StatCard
              icon={UtensilsCrossed}
              label="Total Items"
              value={stats.items}
              tint="bg-brown/10 text-brown"
            />
            <StatCard
              icon={Heart}
              label="Featured Items"
              value={stats.featured}
              tint="bg-red-100 text-red-500"
            />
            <StatCard
              icon={CheckCircle2}
              label="Available Items"
              value={stats.available}
              tint="bg-green-100 text-green-600"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
