import { useEffect, useState, useMemo } from "react";
import { api, resolveMedia } from "../../lib/api";
import { Plus, Pencil, Trash2, X, Package, Eye, EyeOff, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "../../components/FileUploader";

const empty = {
  name: "", slug: "", description: "", long_description: "",
  cover_image: "", banner_image: "", icon: "",
  product_ids: [], seo_title: "", seo_description: "",
  featured: false, trending: false, show_on_homepage: true, active: true, order: 0,
};

const AdminCorporate = () => {
  const [items, setItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [prodSearch, setProdSearch] = useState("");
  const [tab, setTab] = useState("details");

  const load = () =>
    Promise.all([api.get("/corporate-categories"), api.get("/products?limit=1000")])
      .then(([c, p]) => { setItems(c.data); setAllProducts(p.data); })
      .catch(() => {}).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const open = (item) => {
    if (item) { setEditing(item); setForm({ ...empty, ...item, product_ids: item.product_ids || [] }); }
    else { setEditing(null); setForm({ ...empty, order: items.length }); }
    setShowForm(true); setTab("details"); setProdSearch("");
  };
  const close = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    try {
      if (editing) { await api.put(`/admin/corporate-categories/${editing.id}`, form); toast.success("Updated"); }
      else { await api.post("/admin/corporate-categories", form); toast.success("Created"); }
      close(); load();
    } catch { toast.error("Could not save"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this corporate category?")) return;
    try { await api.delete(`/admin/corporate-categories/${id}`); toast.success("Deleted"); load(); }
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

  const toggle = async (item, field) => {
    try {
      await api.put(`/admin/corporate-categories/${item.id}`, { ...item, [field]: !item[field] });
      load();
    } catch { toast.error("Could not update"); }
  };

  return (
    <div className="p-10 lg:p-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="eyebrow mb-3">CMS</div>
          <h1 className="font-display text-4xl md:text-5xl text-white">Corporate Categories</h1>
          <p className="text-neutral-500 text-sm font-light mt-2">Manage the dynamic corporate gifting section on your website.</p>
        </div>
        <button onClick={() => open(null)} className="btn-gold"><Plus size={14} /> New Category</button>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-[#141414] animate-pulse rounded" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#D4AF37]/20 rounded-xl">
          <Package size={36} className="text-amber-brand/30 mx-auto mb-4" />
          <p className="text-neutral-400 text-sm uppercase tracking-[0.3em]">No corporate categories yet</p>
          <p className="text-neutral-600 text-xs mt-2">Create your first category to make the corporate section dynamic.</p>
          <button onClick={() => open(null)} className="btn-gold mt-6"><Plus size={13} /> Create First Category</button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((cat) => (
            <div key={cat.id} className="bg-[#0e0e0e] border border-[#D4AF37]/15 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-center gap-4">
                {cat.cover_image ? (
                  <img src={resolveMedia(cat.cover_image, 100)} alt="" className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-[#D4AF37]/20" />
                ) : (
                  <div className="w-14 h-14 bg-[#15151a] rounded-lg flex-shrink-0 flex items-center justify-center border border-[#D4AF37]/15">
                    <span className="text-2xl">{cat.icon || "🎁"}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-display text-lg text-white">{cat.name}</h3>
                    {cat.featured && <span className="text-[9px] bg-amber-brand/20 text-amber-brand px-2 py-0.5 rounded-full border border-amber-brand/30 font-semibold uppercase tracking-wider">Featured</span>}
                    {cat.trending && <span className="text-[9px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30 font-semibold uppercase tracking-wider">Trending</span>}
                    {!cat.active && <span className="text-[9px] bg-red-900/20 text-red-400 px-2 py-0.5 rounded-full border border-red-900/30 font-semibold uppercase tracking-wider">Hidden</span>}
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-1">{cat.description || "No description"}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-neutral-600">
                    <span>{cat.product_ids?.length || 0} products</span>
                    <span>/corporate/{cat.slug}</span>
                    <span>Order: {cat.order}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggle(cat, "active")} title={cat.active ? "Hide" : "Show"} className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${cat.active ? "border-emerald-700 text-emerald-400 hover:bg-emerald-900/20" : "border-neutral-700 text-neutral-500 hover:bg-neutral-800"}`}>
                    {cat.active ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button onClick={() => toggle(cat, "featured")} title="Toggle featured" className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${cat.featured ? "border-amber-500 text-amber-brand" : "border-neutral-700 text-neutral-600 hover:text-amber-brand"}`}>
                    <Star size={12} />
                  </button>
                  <button onClick={() => toggle(cat, "trending")} title="Toggle trending" className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${cat.trending ? "border-orange-500 text-orange-400" : "border-neutral-700 text-neutral-600 hover:text-orange-400"}`}>
                    <TrendingUp size={12} />
                  </button>
                  <button onClick={() => open(cat)} className="btn-ghost-gold !py-1.5 !px-3 !text-[10px]"><Pencil size={11} /> Edit</button>
                  <button onClick={() => remove(cat.id)} className="btn-ghost-gold !py-1.5 !px-3 !text-[10px] !text-red-400 !border-red-900"><Trash2 size={11} /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-in form panel */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-end p-0">
          <div className="bg-[#0a0a0a] border-l border-[#D4AF37]/25 w-full max-w-2xl h-full overflow-y-auto p-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl text-white">{editing ? "Edit Category" : "New Category"}</h2>
              <button onClick={close} className="text-neutral-400 hover:text-white"><X size={20} /></button>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 mb-6 border border-[#D4AF37]/20 rounded-lg p-1">
              {["details", "media", "products", "seo"].map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all capitalize ${tab === t ? "bg-[#D4AF37] text-[#0a0a0d]" : "text-neutral-400 hover:text-white"}`}>
                  {t}
                </button>
              ))}
            </div>

            <form onSubmit={submit}>
              {tab === "details" && (
                <div className="space-y-5">
                  <div>
                    <label className="eyebrow block mb-2">Category Name *</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Employee Welcome Kits" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2">Slug (URL) <span className="text-neutral-600 normal-case text-[10px]">— auto-generated if blank</span></label>
                    <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="employee-welcome-kits" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light font-mono text-sm" />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2">Icon (Emoji or URL)</label>
                    <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🎁 or leave blank" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2">Short Description</label>
                    <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description shown on the corporate page" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light resize-none" />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2">Full Description <span className="text-neutral-600 normal-case text-[10px]">— shown on dedicated page</span></label>
                    <textarea rows={4} value={form.long_description} onChange={(e) => setForm({ ...form, long_description: e.target.value })} placeholder="Detailed description for the /corporate/[slug] page" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="eyebrow block mb-2">Display Order</label>
                      <input type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 outline-none px-4 py-3 text-white font-light" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {[
                      { key: "active", label: "Active (visible)" },
                      { key: "show_on_homepage", label: "Show on Homepage" },
                      { key: "featured", label: "Featured" },
                      { key: "trending", label: "Trending" },
                    ].map((f) => (
                      <label key={f.key} className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} className="w-4 h-4 accent-[#D4AF37]" />
                        <span className="text-sm text-white/80">{f.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {tab === "media" && (
                <div className="space-y-6">
                  <FileUploader value={form.cover_image} onChange={(v) => setForm({ ...form, cover_image: v })} label="Cover Image (shown on corporate page cards)" testid="corp-cover" />
                  <FileUploader value={form.banner_image} onChange={(v) => setForm({ ...form, banner_image: v })} label="Banner Image (header of dedicated page)" testid="corp-banner" />
                </div>
              )}

              {tab === "products" && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-neutral-400">{form.product_ids.length} product{form.product_ids.length !== 1 ? "s" : ""} selected</p>
                    {form.product_ids.length > 0 && (
                      <button type="button" onClick={() => setForm({ ...form, product_ids: [] })} className="text-xs text-red-400 hover:text-red-300">Clear all</button>
                    )}
                  </div>
                  <input value={prodSearch} onChange={(e) => setProdSearch(e.target.value)} placeholder="Search products by name…" className="w-full mb-3 bg-[#0a0a0a] border border-[#D4AF37]/20 outline-none px-4 py-2.5 text-white text-sm font-light" />
                  <div className="max-h-[420px] overflow-y-auto border border-[#D4AF37]/15 rounded divide-y divide-[#D4AF37]/10">
                    {filteredProducts.slice(0, 80).map((p) => {
                      const selected = form.product_ids.includes(p.id);
                      return (
                        <label key={p.id} className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#15151a] transition-colors ${selected ? "bg-[#D4AF37]/5" : ""}`}>
                          <input type="checkbox" checked={selected} onChange={() => toggleProduct(p.id)} className="accent-[#D4AF37]" />
                          <img src={resolveMedia(p.image_url, 60)} alt="" className="w-9 h-9 object-cover rounded flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-white font-light truncate block">{p.name}</span>
                            {p.price && <span className="text-[10px] text-amber-brand">{p.price}</span>}
                          </div>
                          {selected && <Package size={12} className="text-amber-brand flex-shrink-0" />}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {tab === "seo" && (
                <div className="space-y-5">
                  <div>
                    <label className="eyebrow block mb-2">SEO Title</label>
                    <input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} placeholder="e.g. Employee Welcome Kits — Amazing Groups" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2">Meta Description</label>
                    <textarea rows={3} value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} placeholder="160-character description for search engines" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light resize-none" />
                    <p className="text-[10px] text-neutral-600 mt-1">{form.seo_description.length}/160 characters</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-6 mt-6 border-t border-[#D4AF37]/10">
                <button type="submit" className="btn-gold flex-1">{editing ? "Save Changes" : "Create Category"}</button>
                <button type="button" onClick={close} className="btn-ghost-gold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCorporate;
