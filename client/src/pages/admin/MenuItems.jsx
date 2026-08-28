import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, ImageOff, Heart, Eye, EyeOff } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import {
  fetchCategories,
  fetchMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../services/api";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  available: true,
  featured: false,
  image: null,
};

const MenuItems = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [catRes, menuRes] = await Promise.all([fetchCategories(), fetchMenu()]);
      setCategories(catRes.data.data);
      setItems(menuRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories[0]?._id || "" });
    setPreview(null);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      category: item.category?._id || "",
      description: item.description || "",
      price: item.price,
      available: item.available,
      featured: item.featured,
      image: null,
    });
    setPreview(item.image?.url || null);
    setError("");
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.category || form.price === "") {
      setError("Name, category and price are required");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("category", form.category);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("available", form.available);
      fd.append("featured", form.featured);
      if (form.image) fd.append("image", form.image);

      if (editingId) {
        await updateMenuItem(editingId, fd);
      } else {
        await createMenuItem(fd);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this menu item? This cannot be undone.")) return;
    try {
      await deleteMenuItem(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete item");
    }
  };

  const toggleField = async (item, field) => {
    try {
      const fd = new FormData();
      fd.append(field, !item[field]);
      await updateMenuItem(item._id, fd);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-cream">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-brown-dark mb-1">Menu Items</h1>
            <p className="text-sm text-brown-light">Add, edit and manage what customers see.</p>
          </div>
          <button
            onClick={openAddModal}
            disabled={categories.length === 0}
            className="flex items-center gap-1.5 bg-accent text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {categories.length === 0 && !loading && (
          <p className="text-sm text-brown-light mb-4 bg-white p-3 rounded-lg border border-brown/10">
            Create a category first before adding menu items.
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-xl2 skeleton animate-shimmer" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-brown-light text-center py-16">No menu items yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-xl2 shadow-card overflow-hidden">
                <div className="relative aspect-video bg-cream-dark">
                  {item.image?.url ? (
                    <img src={item.image.url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brown-light/50">
                      <ImageOff size={24} />
                    </div>
                  )}
                  {!item.available && (
                    <span className="absolute inset-x-0 bottom-0 bg-brown-dark/85 text-cream text-xs font-semibold text-center py-1">
                      Unavailable
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-brown-dark text-sm">{item.name}</h3>
                    <span className="font-semibold text-accent text-sm shrink-0">₹{item.price}</span>
                  </div>
                  <p className="text-xs text-brown-light mt-1">{item.category?.name}</p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => toggleField(item, "featured")}
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border transition-colors ${
                        item.featured
                          ? "bg-accent/15 text-accent border-accent/30"
                          : "text-brown-light border-brown/15 hover:border-accent/40"
                      }`}
                    >
                      <Heart size={12} /> Most Loved
                    </button>
                    <button
                      onClick={() => toggleField(item, "available")}
                      className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full border transition-colors ${
                        !item.available
                          ? "bg-red-50 text-red-500 border-red-200"
                          : "text-brown-light border-brown/15 hover:border-red-300"
                      }`}
                    >
                      {item.available ? <EyeOff size={12} /> : <Eye size={12} />}
                      {item.available ? "Mark unavailable" : "Mark available"}
                    </button>
                  </div>

                  <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-brown/5">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex items-center gap-1 text-xs font-semibold text-brown-light hover:text-accent"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1 text-xs font-semibold text-brown-light hover:text-red-500"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <div className="fixed inset-0 bg-brown-dark/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-cream w-full sm:max-w-lg sm:rounded-xl2 rounded-t-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-brown/10 sticky top-0 bg-cream">
              <h2 className="font-display text-lg font-semibold text-brown-dark">
                {editingId ? "Edit item" : "Add new item"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-brown-light hover:text-brown-dark">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brown-dark mb-1">Photo</label>
                <label className="flex items-center justify-center h-32 rounded-xl2 border-2 border-dashed border-brown/20 bg-white cursor-pointer overflow-hidden">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-brown-light">Tap to upload image</span>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brown-dark mb-1">Item name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-brown/10 focus:border-accent outline-none"
                  placeholder="e.g. Masala Chai"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brown-dark mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-brown/10 focus:border-accent outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brown-dark mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-brown/10 focus:border-accent outline-none"
                    placeholder="99"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brown-dark mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full bg-white rounded-lg px-3 py-2.5 text-sm border border-brown/10 focus:border-accent outline-none resize-none"
                  placeholder="Short, tasty description"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-brown-dark">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="accent-accent w-4 h-4"
                  />
                  Available
                </label>
                <label className="flex items-center gap-2 text-sm text-brown-dark">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="accent-accent w-4 h-4"
                  />
                  Most Loved
                </label>
              </div>

              {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-accent text-white font-semibold py-3 rounded-full hover:bg-accent-dark transition-colors disabled:opacity-70"
              >
                {saving ? "Saving…" : editingId ? "Save changes" : "Add item"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;
