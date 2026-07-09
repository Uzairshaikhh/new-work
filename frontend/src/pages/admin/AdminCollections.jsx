import { useEffect, useState, useMemo } from "react";
import { api, resolveMedia } from "../../lib/api";
import { Plus, Pencil, Trash2, X, Package } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "../../components/FileUploader";

const TYPES = [
  { key: "festival",  label: "Festival Collection" },
  { key: "corporate", label: "Corporate Collection" },
  { key: "industry",  label: "Industry Collection" },
  { key: "custom",    label: "Custom / Other" },
];

const empty = { title: "", type: "festival", description: "", image_url: "", badge: "", product_ids: [], active: true, order: 0 };

const AdminCollections = () => {
  const [items, setItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [prodSearch, setProdSearch] = useState("");

  const load = () =>
    Promise.all([api.get("/collections"), api.get("/products?limit=1000")])
      .then(([c, p]) => { setItems(c.data); setAllProducts(p.data); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const open = (item) => {
    if (item) { setEditing(item); setForm({ ...empty, ...item, product_ids: item.product_ids || [] }); }
    else { setEditing(null); setForm({ ...empty, order: items.length }); }
    setShowForm(true);
    setProdSearch("");
  };
  const close = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    try {
      if (editing) { await api.put(`/admin/collections/${editing.id}`, form); toast.success("Updated"); }
      else { await api.post("/admin/collections", form); toast.success("Created"); }
      close(); load();
    } catch { toast.error("Could not save"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this collection?")) return;
    try { await api.delete(`/admin/collections/${id}`); toast.success("Deleted"); load(); }
    catch { toast.error("Could not delete"); }
  };

  const toggleProduct = (pid) => {
    const ids = form.product_ids.includes(pid)
      ? form.product_ids.filter((x) => x !== pid)
      : [...form.product_ids, pid];
    setForm({ ...form, product_ids: ids });
  };

  const filteredProducts = useMemo(() => {
    const q = prodSearch.toLowerCase();
    return q ? allProducts.filter((p) => p.name.toLowerCase().includes(q)) : allProducts;
  }, [allProducts, prodSearch]);

  return (
    <div className="p-10 lg:p-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="eyebrow mb-3">Curated</div>
          <h1 className="font-display text-4xl md:text-5xl text-white">Collections</h1>
        </div>
        <button onClick={() => open(null)} className="btn-gold"><Plus size={14} /> New Collection</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-[#141414] animate-pulse rounded" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#D4AF37]/20">
          <p className="text-neutral-400 text-sm uppercase tracking-[0.3em]">No collections yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((col) => (
            <div key={col.id} className="group bg-[#0e0e0e] border border-[#D4AF37]/15 rounded-xl overflow-hidden hover:border-[#D4AF37]/40 transition-all">
              {col.image_url && (
                <div className="h-36 overflow-hidden">
                  <img src={resolveMedia(col.image_url, 400)} alt={col.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] uppercase tracking-wider text-amber-brand mb-1">{TYPES.find((t) => t.key === col.type)?.label || col.type}</div>
                    <h3 className="font-display text-lg text-white truncate">{col.title}</h3>
                    {col.badge && <span className="inline-block mt-1 text-[9px] bg-amber-brand/20 text-amber-brand px-2 py-0.5 rounded">{col.badge}</span>}
                    <p className="text-xs text-neutral-600 mt-1">{col.product_ids?.length || 0} products · {col.active ? "Active" : "Hidden"}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => open(col)} className="w-8 h-8 flex items-center justify-center bg-[#0a0a0a] border border-[#D4AF37]/30 text-amber-brand rounded hover:bg-[#D4AF37]/10 transition-colors"><Pencil size={12} /></button>
                    <button onClick={() => remove(col.id)} className="w-8 h-8 flex items-center justify-center bg-[#0a0a0a] border border-red-900 text-red-400 rounded hover:bg-red-900/20 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-end p-0 overflow-y-auto">
          <div className="bg-[#0a0a0a] border-l border-[#D4AF37]/25 w-full max-w-2xl min-h-full p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl text-white">{editing ? "Edit Collection" : "New Collection"}</h2>
              <button onClick={close} className="text-neutral-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="eyebrow block mb-2">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Diwali 2025 Hampers" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block mb-2">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light">
                    {TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="eyebrow block mb-2">Badge Label</label>
                  <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. New, Trending" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
                </div>
              </div>
              <div>
                <label className="eyebrow block mb-2">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description of this collection" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light resize-none" />
              </div>
              <FileUploader value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Cover Image" testid="collection-image" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block mb-2">Order</label>
                  <input type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 outline-none px-4 py-3 text-white font-light" />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-[#D4AF37]" />
                    <span className="text-sm text-white/80">Active (visible on site)</span>
                  </label>
                </div>
              </div>

              {/* Product picker */}
              <div>
                <label className="eyebrow block mb-2">Products in Collection ({form.product_ids.length} selected)</label>
                <input value={prodSearch} onChange={(e) => setProdSearch(e.target.value)} placeholder="Search products..." className="w-full mb-2 bg-[#0a0a0a] border border-[#D4AF37]/20 outline-none px-4 py-2.5 text-white text-sm font-light" />
                <div className="max-h-52 overflow-y-auto border border-[#D4AF37]/15 rounded divide-y divide-[#D4AF37]/10">
                  {filteredProducts.slice(0, 50).map((p) => {
                    const selected = form.product_ids.includes(p.id);
                    return (
                      <label key={p.id} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#15151a] transition-colors ${selected ? "bg-[#D4AF37]/5" : ""}`}>
                        <input type="checkbox" checked={selected} onChange={() => toggleProduct(p.id)} className="accent-[#D4AF37]" />
                        <img src={resolveMedia(p.image_url, 60)} alt="" className="w-9 h-9 object-cover rounded" />
                        <span className="text-sm text-white font-light truncate flex-1">{p.name}</span>
                        {selected && <Package size={12} className="text-amber-brand flex-shrink-0" />}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-gold flex-1">{editing ? "Save Changes" : "Create Collection"}</button>
                <button type="button" onClick={close} className="btn-ghost-gold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCollections;
