import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Plus, Pencil, Trash2, X, GripVertical } from "lucide-react";
import { toast } from "sonner";

const empty = { question: "", answer: "", order: 0 };

const AdminFAQs = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const load = () =>
    api.get("/faqs")
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const open = (item) => {
    if (item) { setEditing(item); setForm({ ...item }); }
    else { setEditing(null); setForm({ ...empty, order: items.length }); }
    setShowForm(true);
  };
  const close = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/admin/faqs/${editing.id}`, form);
        toast.success("FAQ updated");
      } else {
        await api.post("/admin/faqs", form);
        toast.success("FAQ created");
      }
      close(); load();
    } catch {
      toast.error("Could not save FAQ");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await api.delete(`/admin/faqs/${id}`);
      toast.success("FAQ deleted");
      load();
    } catch {
      toast.error("Could not delete FAQ");
    }
  };

  return (
    <div className="p-10 lg:p-14">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="eyebrow mb-3">Content</div>
          <h1 className="font-display text-4xl md:text-5xl text-white">FAQs</h1>
        </div>
        <button onClick={() => open(null)} className="btn-gold">
          <Plus size={14} /> Add FAQ
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#141414] animate-pulse rounded" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#D4AF37]/20">
          <p className="text-neutral-400 text-sm uppercase tracking-[0.3em]">No FAQs yet</p>
          <p className="text-neutral-600 text-xs mt-2">Add questions that customers commonly ask</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((faq, i) => (
            <div key={faq.id} className="bg-[#0e0e0e] border border-[#D4AF37]/15 p-5 flex items-start gap-4">
              <GripVertical size={16} className="text-neutral-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white mb-1">{faq.question}</p>
                <p className="text-xs text-neutral-400 line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => open(faq)} className="btn-ghost-gold !py-2 !px-3 !text-[10px]">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => remove(faq.id)} className="btn-ghost-gold !py-2 !px-3 !text-[10px] !text-red-400 !border-red-900">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/25 max-w-xl w-full p-10 gold-glow my-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl text-white">{editing ? "Edit FAQ" : "New FAQ"}</h2>
              <button onClick={close} className="text-neutral-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="eyebrow block mb-3">Question</label>
                <input
                  type="text"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="e.g. What is the minimum order quantity?"
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                />
              </div>
              <div>
                <label className="eyebrow block mb-3">Answer</label>
                <textarea
                  required
                  rows={4}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Provide a clear, helpful answer..."
                  className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light resize-none"
                />
              </div>
              <div>
                <label className="eyebrow block mb-3">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                  className="w-32 bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-gold flex-1">
                  {editing ? "Save Changes" : "Create FAQ"}
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

export default AdminFAQs;
