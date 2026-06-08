import { useEffect, useState } from "react";
import { api, resolveMedia } from "../../lib/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "../../components/FileUploader";

const open = (item) => {
  if (item) {
    setEditing(item);
    setForm({
      ...empty,
      ...item,
      images: item.images || [],
      subcategory_id: item.subcategory_id || "",
    });
  } else {
    setEditing(null);
    setForm({
      ...empty,
      category_id: categories[0]?.id || "",
      subcategory_id: "",
    });
  }
  setShowForm(true);
};

const AdminProducts = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

 const load = () =>
  Promise.all([
    api.get("/products"),
    api.get("/categories"),
    api.get("/subcategories")
  ])
  .then(([p, c, s]) => {
    setItems(p.data);
    setCategories(c.data);
    setSubcategories(s.data);
  })
  .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const open = (item) => {
    if (item) { setEditing(item); setForm({ ...empty, ...item, images: item.images || [] }); }
    else { setEditing(null); setForm({ ...empty, category_id: categories[0]?.id || "" }); }
    setShowForm(true);
  };
  const close = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    try {
      if (editing) {
        await api.put(`/admin/products/${editing.id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/admin/products", payload);
        toast.success("Product created");
      }
      close(); load();
    } catch {
      toast.error("Could not save product");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success("Product deleted");
      load();
    } catch {
      toast.error("Could not delete product");
    }
  };

  const addGalleryImg = (urls) => {
  if (!urls) return;

  const arr = Array.isArray(urls) ? urls : [urls];

  setForm({
    ...form,
    images: [...form.images, ...arr]
  });
};

  const removeGalleryImg = (i) => {
    setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });
  };

  const catName = (id) => categories.find((c) => c.id === id)?.name || "—";

  return (
    <div className="p-10 lg:p-14" data-testid="admin-products-page">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="eyebrow mb-3">Catalogue</div>
          <h1 className="font-display text-4xl md:text-5xl text-white">Products</h1>
        </div>
        <button
          onClick={() => open(null)}
          className="btn-gold disabled:opacity-50"
          disabled={categories.length === 0}
          data-testid="add-product-btn"
        >
          <Plus size={14} /> Add Product
        </button>
      </div>

      {categories.length === 0 && !loading && (
        <div className="mb-8 p-5 border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-sm text-neutral-300">
          Create a collection first before adding products.
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-72 bg-[#141414] animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#D4AF37]/20">
          <p className="text-neutral-400 text-sm uppercase tracking-[0.3em]">No products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="products-list">
          {items.map((p) => (
            <div key={p.id} className="bg-[#0e0e0e] border border-[#D4AF37]/15 flex" data-testid={`product-row-${p.id}`}>
              <div className="w-32 h-full min-h-[10rem] flex-shrink-0 bg-[#080808]">
                {p.image_url && <img src={resolveMedia(p.image_url)} alt={p.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 p-5 flex flex-col">
                <div className="eyebrow text-[9px]">{catName(p.category_id)}{p.featured && " · Featured"}</div>
                <h3 className="font-display text-lg text-white mt-2 line-clamp-2">{p.name}</h3>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{p.description}</p>
                <div className="mt-auto pt-3 flex gap-2">
                  <button onClick={() => open(p)} className="btn-ghost-gold !py-2 !px-3 !text-[10px]" data-testid={`edit-product-${p.id}`}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => remove(p.id)} className="btn-ghost-gold !py-2 !px-3 !text-[10px] !text-red-400 !border-red-900" data-testid={`delete-product-${p.id}`}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 overflow-y-auto" data-testid="product-form-modal">
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/25 max-w-2xl w-full p-10 gold-glow my-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl text-white">{editing ? "Edit Product" : "New Product"}</h2>
              <button onClick={close} className="text-neutral-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="eyebrow block mb-3">Collection</label>
                <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                  data-testid="product-category-select">
                  <option value="" disabled>Select a collection</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
  <label className="eyebrow block mb-3">Subcategory</label>

  <select
    value={form.subcategory_id || ""}
    onChange={(e) =>
      setForm({
        ...form,
        subcategory_id: e.target.value,
      })
    }
    className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
  >
    <option value="">Select Subcategory</option>

    {subcategories
      .filter((s) => s.category_id === form.category_id)
      .map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
  </select>
</div>

<div>
  <label className="eyebrow block mb-3">Name</label>
  ...
</div>
              <div>
                <label className="eyebrow block mb-3">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                  data-testid="product-name-input" />
              </div>
              <div>
                <label className="eyebrow block mb-3">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                  data-testid="product-desc-input" />
              </div>
              <div>
                <label className="eyebrow block mb-3">Price (display only)</label>
                <input type="text" placeholder="₹ On Request" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
              </div>
              <FileUploader value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Main Image" testid="product-image" />

              <div data-testid="product-gallery-section">
                <label className="eyebrow block mb-3">Additional Gallery Images</label>
                <div className="flex gap-3 flex-wrap mb-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20">
                      <img src={resolveMedia(img)} alt="" className="w-full h-full object-cover border border-[#D4AF37]/20" />
                      <button type="button" onClick={() => removeGalleryImg(i)} className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 flex items-center justify-center text-xs">×</button>
                    </div>
                  ))}
                </div>
                <FileUploader value="" onChange={addGalleryImg} label="Add another gallery image" testid="product-gallery-add" />
              </div>

              <FileUploader value={form.video_url} onChange={(v) => setForm({ ...form, video_url: v })} label="Video (optional)" accept="video/*" testid="product-video" />

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 accent-[#D4AF37]" data-testid="product-featured-checkbox" />
                <span className="text-sm text-neutral-300 font-light">Show on homepage as featured</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-gold flex-1" data-testid="product-form-submit">
                  {editing ? "Save Changes" : "Create Product"}
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

export default AdminProducts;
