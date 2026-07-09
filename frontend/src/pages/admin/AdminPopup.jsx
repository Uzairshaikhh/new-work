import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import FileUploader from "../../components/FileUploader";

const defaults = {
  enabled: false,
  title: "",
  description: "",
  image_url: "",
  cta_text: "WhatsApp Us",
  cta_url: "",
  delay_ms: 3000,
};

const AdminPopup = () => {
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/popup").then((r) => {
      if (r.data) setForm({ ...defaults, ...r.data });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/admin/popup", form);
      toast.success("Popup settings saved");
    } catch { toast.error("Could not save"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-14 text-white">Loading…</div>;

  return (
    <div className="p-10 lg:p-14 max-w-2xl">
      <div className="mb-8">
        <div className="eyebrow mb-3">Marketing</div>
        <h1 className="font-display text-4xl md:text-5xl text-white">Popup Manager</h1>
        <p className="text-neutral-400 text-sm mt-3 font-light">Show a promotional popup to site visitors. It's dismissed per session.</p>
      </div>

      <div className="space-y-5">
        <label className="flex items-center gap-3 cursor-pointer p-4 border border-[#D4AF37]/20 rounded hover:border-[#D4AF37]/40 transition-colors">
          <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} className="w-4 h-4 accent-[#D4AF37]" />
          <div>
            <span className="text-white font-medium text-sm">Enable Popup</span>
            <p className="text-xs text-neutral-500">When enabled, visitors see this popup after the delay.</p>
          </div>
        </label>

        <div>
          <label className="eyebrow block mb-2">Popup Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. 🎉 Diwali Sale — Up to 30% Off on Bulk Orders" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
        </div>

        <div>
          <label className="eyebrow block mb-2">Description</label>
          <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short compelling message" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light resize-none" />
        </div>

        <FileUploader value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} label="Banner Image (optional)" testid="popup-image" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="eyebrow block mb-2">CTA Button Text</label>
            <input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} placeholder="WhatsApp Us" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
          </div>
          <div>
            <label className="eyebrow block mb-2">CTA Link</label>
            <input value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} placeholder="https://wa.me/91…" className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light" />
          </div>
        </div>

        <div>
          <label className="eyebrow block mb-2">Delay Before Showing</label>
          <select value={form.delay_ms} onChange={(e) => setForm({ ...form, delay_ms: Number(e.target.value) })} className="bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light">
            <option value={1000}>1 second</option>
            <option value={3000}>3 seconds</option>
            <option value={5000}>5 seconds</option>
            <option value={10000}>10 seconds</option>
            <option value={15000}>15 seconds</option>
          </select>
        </div>

        <button onClick={save} disabled={saving} className="btn-gold !py-3 !px-8 disabled:opacity-60">
          {saving ? <Loader2 size={15} className="animate-spin" /> : null}
          {saving ? "Saving…" : "Save Popup Settings"}
        </button>
      </div>
    </div>
  );
};

export default AdminPopup;
