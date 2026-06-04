import { useEffect, useMemo, useState } from "react";
import { api, resolveMedia } from "../../lib/api";
import { Plus, Pencil, Trash2, X, CheckCircle, Slash } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "../../components/FileUploader";

const empty = {
  category_id: "",
  name: "",
  slug: "",
  description: "",
  image_url: "",
  status: "active",
  sort_order: 0,
};

const AdminSubcategories = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [selected, setSelected] = useState(new Set());

  const load = () =>
    Promise.all([api.get("/subcategories"), api.get("/categories")])
      .then(([s, c]) => {
        setItems(s.data);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const open = (item) => {
    if (item) {
      setEditing(item);
      setForm({ ...empty, ...item });
    } else {
      setEditing(null);
      setForm({ ...empty, category_id: categories[0]?.id || "" });
    }
    setShowForm(true);
  };

  const close = () => {
    setShowForm(false);
    setEditing(null);
    setForm(empty);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.category_id) {
      toast.error("Please select a parent category.");
      return;
    }
    try {
      if (editing) {
        await api.put(`/admin/subcategories/${editing.id}`, form);
        toast.success("Subcategory updated");
      } else {
        await api.post("/admin/subcategories", form);
        toast.success("Subcategory created");
      }
      close();
      load();
    } catch {
      toast.error("Could not save subcategory");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this subcategory? All its products will be removed.")) return;
    try {
      await api.delete(`/admin/subcategories/${id}`);
      toast.success("Subcategory deleted");
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      load();
    } catch {
      toast.error("Could not delete subcategory");
    }
  };

  const bulkAction = async (action) => {
    if (selected.size === 0) {
      toast.error("Select at least one subcategory.");
      return;
    }
    if (action === "delete" && !window.confirm("Delete selected subcategories?")) return;

    try {
      await Promise.all(
        Array.from(selected).map((id) => {
          if (action === "delete") return api.delete(`/admin/subcategories/${id}`);
          const status = action === "activate" ? "active" : "inactive";
          return api.put(`/admin/subcategories/${id}`, { ...items.find((i) => i.id === id), status });
        })
      );
      toast.success(`Bulk ${action} completed`);
      setSelected(new Set());
      load();
    } catch {
      toast.error(`Could not ${action} selected subcategories`);
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categoryLookup = useMemo(
    () => categories.reduce((acc, c) => ({ ...acc, [c.id]: c.name }), {}),
    [categories]
  );

  return (
    <div className="p-10 lg:p-14" data-testid="admin-subcategories-page">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
        <div>
          <div className="eyebrow mb-3">Catalogue</div>
          <h1 className="font-display text-4xl md:text-5xl text-white">Subcategories</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => open(null)} className="btn-gold" data-testid="add-subcategory-btn">
            <Plus size={14} /> Add Subcategory
          </button>
          <button onClick={() => bulkAction("activate")} className="btn-ghost-gold !py-2 !px-4 !text-[10px]">
            <CheckCircle size={14} /> Bulk Activate
          </button>
          <button onClick={() => bulkAction("deactivate")} className="btn-ghost-gold !py-2 !px-4 !text-[10px]">
            <Slash size={14} /> Bulk Deactivate
          </button>
          <button onClick={() => bulkAction("delete")} className="btn-ghost-gold !py-2 !px-4 !text-[10px] !text-red-400 !border-red-900">
            <Trash2 size={14} /> Bulk Delete
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 bg-[#141414] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#D4AF37]/20">
          <p className="text-neutral-400 text-sm uppercase tracking-[0.3em]">No subcategories yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6" data-testid="subcategories-list">
          {items.map((sub) => (
            <div key={sub.id} className="bg-[#0e0e0e] border border-[#D4AF37]/15 p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <label className="inline-flex items-center gap-3 text-sm text-white/80">
                  <input type="checkbox" checked={selected.has(sub.id)} onChange={() => toggleSelect(sub.id)} className="accent-[#D4AF37]" />
                  <span>{sub.name}</span>
                </label>
                <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.25em] ${sub.status === "active" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
                  {sub.status}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-gray-500">Category</div>
                  <div className="text-sm text-white">{categoryLookup[sub.category_id] || "Unknown"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-gray-500">Slug</div>
                  <div className="text-sm text-white">{sub.slug || "—"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-gray-500">Sort order</div>
                  <div className="text-sm text-white">{sub.sort_order}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => open(sub)} className="btn-ghost-gold !py-2 !px-3 !text-[10px]" data-testid={`edit-subcategory-${sub.id}`}>
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => remove(sub.id)} className="btn-ghost-gold !py-2 !px-3 !text-[10px] !text-red-400 !border-red-900" data-testid={`delete-subcategory-${sub.id}`}>
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 overflow-y-auto" data-testid="subcategory-form-modal">
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/25 max-w-xl w-full p-10 gold-glow my-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl text-white">{editing ? "Edit Subcategory" : "New Subcategory"}</h2>
              <button onClick={close} className="text-neutral-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="eyebrow block mb-3">Parent Category</label>
                <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                  data-testid="subcategory-category-select">
                  <option value="" disabled>Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="eyebrow block mb-3">Name</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                    data-testid="subcategory-name-input" />
                </div>
                <div>
                  <label className="eyebrow block mb-3">Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                    data-testid="subcategory-slug-input" />
                </div>
              </div>
              <div>
                <label className="eyebrow block mb-3">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                  data-testid="subcategory-desc-input" />
              </div>
              <FileUploader value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Image" testid="subcategory-image" />
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="eyebrow block mb-3">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                    data-testid="subcategory-status-select">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="eyebrow block mb-3">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                    data-testid="subcategory-sort-input" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-gold flex-1" data-testid="subcategory-form-submit">
                  {editing ? "Save Changes" : "Create Subcategory"}
                </button>
                <button type="button" onClick={close} className="btn-ghost-gold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubcategories;
