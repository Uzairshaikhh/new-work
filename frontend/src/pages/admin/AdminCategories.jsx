import { useEffect, useState } from "react";
import { api, resolveMedia } from "../../lib/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "../../components/FileUploader";

const empty = { name: "", description: "", image_url: "" };

const AdminCategories = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () =>
    api.get("/categories").then((r) => setItems(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const open = (item) => {
    if (item) { setEditing(item); setForm({ ...empty, ...item }); }
    else { setEditing(null); setForm(empty); }
    setShowForm(true);
  };
  const close = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/categories/${editing.id}`, form);
        toast.success("Collection updated");
      } else {
        await api.post("/admin/categories", form);
        toast.success("Collection created");
      }
      close(); load();
    } catch {
      toast.error("Could not save collection");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this category? All its products will be removed.")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success("Collection deleted");
      load();
    } catch {
      toast.error("Could not delete collection");
    }
  };

  return (
    <div className="p-10 lg:p-14" data-testid="admin-categories-page">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="eyebrow mb-3">Catalogue</div>
          <h1 className="font-display text-4xl md:text-5xl text-white">Collections</h1>
        </div>
        <button onClick={() => open(null)} className="btn-gold" data-testid="add-category-btn">
          <Plus size={14} /> Add Collection
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[4/5] bg-[#141414] animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#D4AF37]/20">
          <p className="text-neutral-400 text-sm uppercase tracking-[0.3em]">No collections yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="categories-list">
          {items.map((c) => (
            <div key={c.id} className="bg-[#0e0e0e] border border-[#D4AF37]/15" data-testid={`category-row-${c.id}`}>
              <div className="aspect-[4/3] bg-[#080808]">
                {c.image_url && <img src={resolveMedia(c.image_url)} alt={c.name} className="w-full h-full object-cover" />}
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl text-white">{c.name}</h3>
                {c.description && <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{c.description}</p>}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => open(c)} className="btn-ghost-gold !py-2 !px-3 !text-[10px]" data-testid={`edit-category-${c.id}`}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => remove(c.id)} className="btn-ghost-gold !py-2 !px-3 !text-[10px] !text-red-400 !border-red-900" data-testid={`delete-category-${c.id}`}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 overflow-y-auto" data-testid="category-form-modal">
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/25 max-w-xl w-full p-10 gold-glow my-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl text-white">{editing ? "Edit Collection" : "New Collection"}</h2>
              <button onClick={close} className="text-neutral-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="eyebrow block mb-3">Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" data-testid="category-name-input" />
              </div>
              <div>
                <label className="eyebrow block mb-3">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" data-testid="category-desc-input" />
              </div>
              <FileUploader value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Cover Image" testid="category-image" />
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-gold flex-1" data-testid="category-form-submit">
                  {editing ? "Save Changes" : "Create Collection"}
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

export default AdminCategories;
