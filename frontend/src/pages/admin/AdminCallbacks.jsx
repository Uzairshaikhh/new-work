import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Phone, Clock, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const STATUS_STYLES = {
  pending:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
  contacted: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  closed:    "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

const AdminCallbacks = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () =>
    api.get("/admin/callback-requests").then((r) => setItems(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/callback-requests/${id}/status?status=${status}`);
      setItems((prev) => prev.map((x) => x.id === id ? { ...x, status } : x));
      toast.success(`Marked as ${status}`);
    } catch { toast.error("Could not update"); }
  };

  const visible = filter === "all" ? items : items.filter((x) => x.status === filter);

  const fmtDate = (iso) => {
    try { return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
    catch { return iso; }
  };

  return (
    <div className="p-10 lg:p-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="eyebrow mb-3">Leads</div>
          <h1 className="font-display text-4xl md:text-5xl text-white">Callback Requests</h1>
        </div>
        <button onClick={() => { setLoading(true); load(); }} className="btn-ghost-gold !py-2 !px-4 !text-xs">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2.5 mb-6">
        {["all", "pending", "contacted", "closed"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
            filter === s ? "bg-[#D4AF37] text-[#0a0a0d] border-[#D4AF37]" : "text-neutral-400 border-[#D4AF37]/25 hover:text-white"
          }`}>
            {s === "all" ? `All (${items.length})` : `${s} (${items.filter((x) => x.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-[#141414] animate-pulse rounded" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#D4AF37]/20">
          <Phone size={28} className="text-amber-brand/30 mx-auto mb-3" />
          <p className="text-neutral-400 text-sm">No {filter !== "all" ? filter : ""} requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((req) => (
            <div key={req.id} className="bg-[#0e0e0e] border border-[#D4AF37]/15 p-5 hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-white">{req.name}</h3>
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold ${STATUS_STYLES[req.status] || STATUS_STYLES.pending}`}>
                      {req.status}
                    </span>
                  </div>
                  <a href={`tel:${req.phone}`} className="text-amber-brand text-sm font-medium hover:underline flex items-center gap-1.5">
                    <Phone size={12} /> {req.phone}
                  </a>
                  <div className="flex items-center gap-4 mt-1 text-xs text-neutral-500">
                    <span className="flex items-center gap-1"><Clock size={10} /> {req.preferred_time || "Anytime"}</span>
                    <span>{fmtDate(req.created_at)}</span>
                  </div>
                  {req.note && <p className="mt-2 text-xs text-neutral-400 italic">"{req.note}"</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {req.status !== "contacted" && (
                    <button onClick={() => updateStatus(req.id, "contacted")} className="text-[10px] uppercase tracking-wider border border-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded hover:bg-emerald-500/10 transition-colors flex items-center gap-1">
                      <CheckCircle size={10} /> Contacted
                    </button>
                  )}
                  {req.status !== "closed" && (
                    <button onClick={() => updateStatus(req.id, "closed")} className="text-[10px] uppercase tracking-wider border border-neutral-700 text-neutral-500 px-3 py-1.5 rounded hover:bg-neutral-800 transition-colors">
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCallbacks;
