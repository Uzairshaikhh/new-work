import { useEffect, useState } from "react";
import { api, resolveMedia } from "../../lib/api";
import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "../../components/FileUploader";

const empty = { title: "", highlight: "", subtitle: "", image_url: "", cta_label: "Explore", cta_link: "#categories", order: 0 };

const AdminSliders = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [reordering, setReordering] = useState(false);

  const load = () =>
    api
      .get("/sliders")
      .then((r) => setItems(r.data))
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
      setForm(empty);
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
    const payload = { ...form, order: parseInt(form.order, 10) || 0 };
    try {
      if (editing) {
        await api.put(`/admin/sliders/${editing.id}`, payload);
        toast.success("Slider updated");
      } else {
        await api.post("/admin/sliders", payload);
        toast.success("Slider created");
      }
      close();
      load();
    } catch {
      toast.error("Could not save slider");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this slider?")) return;
    try {
      await api.delete(`/admin/sliders/${id}`);
      toast.success("Slider deleted");
      load();
    } catch {
      toast.error("Could not delete slider");
    }
  };

  const move = async (id, direction) => {
    if (reordering) return;
    const idx = items.findIndex((x) => x.id === id);
    const swap = direction === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= items.length) return;
    setReordering(true);
    const a = items[idx];
    const b = items[swap];
    // Swap the order values, then persist both
    try {
      await Promise.all([
        api.put(`/admin/sliders/${a.id}`, { ...a, highlight: a.highlight ?? "", order: b.order }),
        api.put(`/admin/sliders/${b.id}`, { ...b, highlight: b.highlight ?? "", order: a.order }),
      ]);
      toast.success("Order updated");
      await load();
    } catch {
      toast.error("Could not reorder");
    } finally {
      setReordering(false);
    }
  };

  return (
    <div className="p-10 lg:p-14" data-testid="admin-sliders-page">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="eyebrow mb-3">Homepage</div>
          <h1 className="font-display text-4xl md:text-5xl text-white">Sliders</h1>
        </div>
        <button onClick={() => open(null)} className="btn-gold" data-testid="add-slider-btn">
          <Plus size={14} /> Add Slider
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-[#141414] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#D4AF37]/20">
          <p className="text-neutral-400 text-sm uppercase tracking-[0.3em]">No sliders yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="sliders-list">
          {items.map((s, idx) => (
            <div
              key={s.id}
              className="bg-[#0e0e0e] border border-[#D4AF37]/15 overflow-hidden flex"
              data-testid={`slider-row-${s.id}`}
            >
              <div className="w-40 h-40 flex-shrink-0 bg-[#080808]">
                {s.image_url && (
                  <img src={resolveMedia(s.image_url)} alt={s.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 p-5 flex flex-col">
                <div className="eyebrow text-[9px]">Order {s.order}</div>
                <h3 className="font-display text-xl mt-2 line-clamp-2 leading-snug">
                  <span className="text-white">{s.title} </span>
                  {s.highlight && <span className="text-[#D4AF37]">{s.highlight}</span>}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{s.subtitle}</p>
                <div className="mt-auto pt-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => move(s.id, "up")}
                    disabled={idx === 0 || reordering}
                    className="btn-ghost-gold !py-2 !px-3 !text-[10px] disabled:opacity-30 disabled:cursor-not-allowed"
                    data-testid={`move-up-${s.id}`}
                    aria-label="Move up"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => move(s.id, "down")}
                    disabled={idx === items.length - 1 || reordering}
                    className="btn-ghost-gold !py-2 !px-3 !text-[10px] disabled:opacity-30 disabled:cursor-not-allowed"
                    data-testid={`move-down-${s.id}`}
                    aria-label="Move down"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button onClick={() => open(s)} className="btn-ghost-gold !py-2 !px-3 !text-[10px]" data-testid={`edit-slider-${s.id}`}>
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => remove(s.id)} className="btn-ghost-gold !py-2 !px-3 !text-[10px] !text-red-400 !border-red-900" data-testid={`delete-slider-${s.id}`}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 overflow-y-auto" data-testid="slider-form-modal">
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/25 max-w-2xl w-full p-10 gold-glow my-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl text-white">{editing ? "Edit Slider" : "New Slider"}</h2>
              <button onClick={close} className="text-neutral-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="eyebrow block mb-3">Title (White Text)</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" data-testid="slider-title-input" />
              </div>
              <div>
                <label className="eyebrow block mb-3">Highlight Text (Gold)</label>
                <input type="text" value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                  placeholder="e.g. with Your Brand Identity"
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" data-testid="slider-highlight-input" />
                {/* Live preview */}
                {(form.title || form.highlight) && (
                  <div className="mt-3 px-4 py-3 bg-[#15151a] border border-[#D4AF37]/15 rounded">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Preview</p>
                    <p className="font-bold text-lg leading-snug">
                      <span className="text-white">{form.title || "Title"} </span>
                      <span className="text-[#D4AF37]">{form.highlight || ""}</span>
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="eyebrow block mb-3">Subtitle</label>
                <textarea rows={2} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" data-testid="slider-subtitle-input" />
              </div>
              <FileUploader value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Background Image" testid="slider-image" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block mb-3">CTA Label</label>
                  <input type="text" value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
                </div>
                <div>
                  <label className="eyebrow block mb-3">CTA Link</label>
                  <input type="text" value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
                </div>
              </div>
              <div>
                <label className="eyebrow block mb-3">Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="w-32 bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-gold flex-1" data-testid="slider-form-submit">
                  {editing ? "Save Changes" : "Create Slider"}
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

export default AdminSliders;
