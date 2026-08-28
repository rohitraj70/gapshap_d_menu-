import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import {
  fetchCategories,
  fetchMenu,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "" });
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: categoryResponse }, { data: menuResponse }] = await Promise.all([
        fetchCategories(),
        fetchMenu(),
      ]);
      setCategories(categoryResponse.data);
      setItemCounts(
        menuResponse.data.reduce((counts, item) => {
          const categoryId = item.category?._id || item.category;
          if (categoryId) counts[categoryId] = (counts[categoryId] || 0) + 1;
          return counts;
        }, {})
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return;
    try {
      await createCategory({ name: form.name.trim() });
      setForm({ name: "" });
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditForm({ name: cat.name });
  };

  const saveEdit = async (id) => {
    try {
      await updateCategory(id, { name: editForm.name.trim() });
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold text-brown-dark mb-1">Categories</h1>
        <p className="text-sm text-brown-light mb-6">Organize your menu into browsable sections.</p>

        <form onSubmit={handleAdd} className="bg-white rounded-xl2 shadow-card p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-brown-dark mb-1">Category name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Beverages"
              className="w-full bg-cream rounded-lg px-3 py-2 text-sm border border-brown/10 focus:border-accent outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-accent text-white font-semibold px-4 py-2 rounded-lg hover:bg-accent-dark transition-colors"
          >
            <Plus size={16} /> Add
          </button>
        </form>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="bg-white rounded-xl2 shadow-card overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 rounded skeleton animate-shimmer" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="p-6 text-sm text-brown-light text-center">No categories yet. Add your first one above.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-brown-light border-b border-brown/10">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold w-24">Items</th>
                  <th className="px-4 py-3 font-semibold w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-brown/5 last:border-0">
                    <td className="px-4 py-3">
                      {editingId === cat._id ? (
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full bg-cream rounded px-2 py-1 border border-brown/10 outline-none"
                        />
                      ) : (
                        <span className="font-medium text-brown-dark">{cat.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brown-light">{itemCounts[cat._id] || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {editingId === cat._id ? (
                          <>
                            <button onClick={() => saveEdit(cat._id)} className="text-green-600 hover:text-green-700">
                              <Check size={16} />
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-brown-light hover:text-brown-dark">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(cat)} className="text-brown-light hover:text-accent">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDelete(cat._id)} className="text-brown-light hover:text-red-500">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default Categories;
