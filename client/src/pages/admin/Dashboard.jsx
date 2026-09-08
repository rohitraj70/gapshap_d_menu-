import { useEffect, useState } from "react";
import { Tags, UtensilsCrossed, Heart, CheckCircle2, Phone, Power, Save } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import { fetchCategories, fetchMenu, fetchCafeSettings, updateCafeSettings } from "../../services/api";

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
  const [settings, setSettings] = useState({ acceptingOrders: true, customerCareNumber: "" });
  const [settingsMessage, setSettingsMessage] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, menuRes, settingsRes] = await Promise.all([fetchCategories(), fetchMenu(), fetchCafeSettings()]);
        const items = menuRes.data.data;
        setSettings(settingsRes.data.data);
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

  const saveSettings = async (event) => {
    event.preventDefault();
    setSavingSettings(true);
    setSettingsMessage("");

    try {
      const response = await updateCafeSettings(settings);
      setSettings(response.data.data);
      setSettingsMessage("Cafe settings saved.");
    } catch (error) {
      setSettingsMessage(error?.response?.data?.message || "Could not save cafe settings.");
    } finally {
      setSavingSettings(false);
    }
  };

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

        <section className="mt-6 max-w-2xl rounded-2xl border border-brown/10 bg-white p-4 shadow-card sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Power size={21} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-brown-dark">Cafe controls</h2>
              <p className="mt-1 text-sm text-brown-light">Control whether customers can place new orders and set the help number they see.</p>
            </div>
          </div>

          <form onSubmit={saveSettings} className="mt-5 space-y-4">
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-brown/10 bg-cream p-3">
              <span>
                <span className="block text-sm font-semibold text-brown-dark">Accept new orders</span>
                <span className="mt-0.5 block text-xs text-brown-light">Turn this off when the kitchen is closed or busy.</span>
              </span>
              <input
                type="checkbox"
                checked={settings.acceptingOrders}
                onChange={(event) => setSettings((current) => ({ ...current, acceptingOrders: event.target.checked }))}
                className="h-6 w-6 accent-accent"
              />
            </label>

            <label className="block space-y-2 text-sm text-brown-dark">
              <span className="inline-flex items-center gap-2 font-semibold"><Phone size={15} /> Customer care number</span>
              <input
                value={settings.customerCareNumber}
                onChange={(event) => setSettings((current) => ({ ...current, customerCareNumber: event.target.value }))}
                inputMode="tel"
                className="w-full rounded-xl border border-brown/10 bg-cream px-3 py-3 outline-none focus:border-accent"
                placeholder="e.g. 9876543210"
              />
            </label>

            {settingsMessage && <p className="text-sm text-brown-light">{settingsMessage}</p>}

            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white hover:bg-accent-dark disabled:opacity-60"
            >
              <Save size={16} /> {savingSettings ? "Saving..." : "Save settings"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
