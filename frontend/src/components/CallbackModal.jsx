import { useState } from "react";
import { X, Phone, Clock, CheckCircle, Loader2 } from "lucide-react";
import { api } from "../lib/api";

const TIMES = [
  "Morning (9 AM – 12 PM)",
  "Afternoon (12 PM – 4 PM)",
  "Evening (4 PM – 7 PM)",
  "Anytime",
];

const CallbackModal = ({ open, onClose }) => {
  const [form, setForm] = useState({ name: "", phone: "", preferred_time: "Anytime", note: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setLoading(true);
    try {
      await api.post("/callback-request", form);
      setDone(true);
    } catch {
      // silently fail — user already sees a submission
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setDone(false); setForm({ name: "", phone: "", preferred_time: "Anytime", note: "" }); }, 300);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleClose}>
      <div
        className="bg-[#0e0e0e] border border-[#d4af37]/30 w-full max-w-md p-8 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={18} />
        </button>

        {done ? (
          <div className="text-center py-8">
            <CheckCircle size={44} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="font-display text-2xl text-white mb-2">Request Received</h3>
            <p className="text-gray-400 text-sm">We'll call you back within 2 hours during business hours.</p>
            <button onClick={handleClose} className="btn-amber mt-6 !py-2.5 !px-8">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
                <Phone size={18} className="text-amber-brand" />
              </div>
              <div>
                <h3 className="font-display text-xl text-white">Request a Callback</h3>
                <p className="text-xs text-gray-500">We respond within 2 business hours</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="eyebrow block mb-1.5">Your Name *</label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Mehta"
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/20 focus:border-[#d4af37] outline-none px-4 py-3 text-white text-sm font-light"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1.5">Phone Number *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98867 28837"
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/20 focus:border-[#d4af37] outline-none px-4 py-3 text-white text-sm font-light"
                />
              </div>
              <div>
                <label className="eyebrow block mb-1.5">
                  <Clock size={10} className="inline mr-1" /> Preferred Time
                </label>
                <select
                  value={form.preferred_time}
                  onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/20 focus:border-[#d4af37] outline-none px-4 py-3 text-white text-sm font-light"
                >
                  {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="eyebrow block mb-1.5">Brief Note (optional)</label>
                <textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="e.g. Need 500 customised diaries for Diwali"
                  className="w-full bg-[#0a0a0a] border border-[#d4af37]/20 focus:border-[#d4af37] outline-none px-4 py-3 text-white text-sm font-light resize-none"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-amber w-full !py-3 disabled:opacity-60">
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Phone size={15} />}
                {loading ? "Sending…" : "Request Callback"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CallbackModal;
