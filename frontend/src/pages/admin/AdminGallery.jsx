import { useEffect, useState } from "react";
import { api, resolveMedia } from "../../lib/api";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "../../components/FileUploader";

const SECTIONS = [
  { key: "general",        label: "General" },
  { key: "products",       label: "Products" },
  { key: "corporate",      label: "Corporate Orders" },
  { key: "packaging",      label: "Packaging" },
  { key: "events",         label: "Events" },
  { key: "customer_photos",label: "Customer Photos" },
  { key: "process",        label: "Our Process" },
];

const empty = { title: "", description: "", image_url: "", section: "general", order: 0 };

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [filter, setFilter] = useState("all");

  const load = () =>
    api.get("/gallery").then((r) => setItems(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const open = (item) => {
    if (item) { setEditing(item); setForm({ ...item }); }
    else { setEditing(null); setForm({ ...empty, order: items.length }); }
    setShowForm(true);
  };
  const close = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.image_url) { toast.error("Please upload an image"); return; }
    try {
      if (editing) {
        await api.put(`/admin/gallery/${editing.id}`, form);
        toast.success("Photo updated");
      } else {
        await api.post("/admin/gallery", form);
        toast.success("Photo added");
      }
      close(); load();
    } catch { toast.error("Could not save"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    try { await api.delete(`/admin/gallery/${id}`); toast.success("Deleted"); load(); }
    catch { toast.error("Could not delete"); }
  };

  const sectionLabel = (key) => SECTIONS.find((s) => s.key === key)?.label || key;

  const visible = filter === "all" ? items : items.filter((i) => i.section === filter);

  return (
    <div className="p-10 lg:p-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="eyebrow mb-3">Media</div>
          <h1 className="font-display text-4xl md:text-5xl text-white">Gallery</h1>
        </div>
        <button onClick={() => open(null)} className="btn-gold">
          <Plus size={14} /> Add Photo
        </button>
      </div>

      {/* Section filter */}
      <div className="flex items-center gap-2.5 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {[{ key: "all", label: "All" }, ...SECTIONS].map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === s.key
                ? "bg-[#D4AF37] text-[#0a0a0d] border-[#D4AF37]"
                : "bg-transparent text-neutral-400 border-[#D4AF37]/25 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
        <span className="text-xs text-neutral-600 ml-2 flex-shrink-0">{visible.length} photo{visible.length !== 1 ? "s" : ""}</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square bg-[#141414] animate-pulse rounded" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#D4AF37]/20">
          <p className="text-neutral-400 text-sm uppercase tracking-[0.3em]">No photos yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map((item) => (
            <div key={item.id} className="group relative bg-[#0e0e0e] border border-[#D4AF37]/15 rounded-lg overflow-hidden">
              <div className="aspect-square">
                <img src={resolveMedia(item.image_url, 400)} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="text-[9px] uppercase tracking-wider text-amber-brand mb-1">{sectionLabel(item.section)}</div>
                <p className="text-xs text-white font-medium line-clamp-1">{item.title || "Untitled"}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => open(item)} className="w-7 h-7 flex items-center justify-center bg-[#0a0a0a] border border-[#D4AF37]/30 text-amber-brand rounded hover:bg-[#D4AF37]/10 transition-colors">
                  <Pencil size={11} />
                </button>
                <button onClick={() => remove(item.id)} className="w-7 h-7 flex items-center justify-center bg-[#0a0a0a] border border-red-900 text-red-400 rounded hover:bg-red-900/20 transition-colors">
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/25 max-w-lg w-full p-10 gold-glow my-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl text-white">{editing ? "Edit Photo" : "Add Photo"}</h2>
              <button onClick={close} className="text-neutral-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <FileUploader value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Photo" testid="gallery-image" />

              <div>
                <label className="eyebrow block mb-3">Section</label>
                <select
                  value={form.section}
                  onChange={(e) => setForm({ ...form, section: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                >
                  {SECTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="eyebrow block mb-3">Title (optional)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Diwali hampers for Infosys"
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                />
              </div>
              <div>
                <label className="eyebrow block mb-3">Caption (optional)</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short caption"
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                />
              </div>
              <div>
                <label className="eyebrow block mb-3">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-28 bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-gold flex-1">{editing ? "Save Changes" : "Add Photo"}</button>
                <button type="button" onClick={close} className="btn-ghost-gold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
