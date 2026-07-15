import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Images, FolderTree, Package, HelpCircle, GalleryHorizontal, MessageCircle, Phone, Eye, Layers, PhoneCall } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, sub, testid }) => (
  <div
    className="bg-[#0e0e0e] border border-[#D4AF37]/15 rounded-xl p-6 flex flex-col gap-4 hover:border-[#D4AF37]/40 transition-all duration-300"
    data-testid={testid}
  >
    <div className="flex items-start justify-between">
      <div className="w-9 h-9 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
        <Icon size={17} strokeWidth={1.4} className="text-[#D4AF37]" />
      </div>
      {sub && (
        <span className="text-[9px] uppercase tracking-[0.22em] text-[#D4AF37]/50 font-semibold bg-[#D4AF37]/6 border border-[#D4AF37]/15 rounded-full px-2 py-0.5 leading-none">
          {sub}
        </span>
      )}
    </div>
    <div>
      <div className="text-[9px] uppercase tracking-[0.28em] text-neutral-500 font-semibold mb-1.5">{label}</div>
      <div className="font-display text-4xl text-white leading-none">{value}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ categories: 0, products: 0, sliders: 0, faqs: 0, gallery: 0 });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/stats"),
      api.get("/admin/analytics").catch(() => ({ data: null })),
    ]).then(([s, a]) => {
      setStats(s.data);
      setAnalytics(a.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const val = (v) => (loading ? "—" : v ?? 0);

  const contentStats = [
    { icon: Images,            label: "Sliders",     value: val(stats.sliders),             testid: "stat-sliders" },
    { icon: FolderTree,        label: "Categories",  value: val(stats.categories),           testid: "stat-categories" },
    { icon: Package,           label: "Products",    value: val(stats.products),             testid: "stat-products" },
    { icon: HelpCircle,        label: "FAQs",        value: val(stats.faqs),                 testid: "stat-faqs" },
    { icon: GalleryHorizontal, label: "Gallery",     value: val(stats.gallery),              testid: "stat-gallery" },
    { icon: Layers,            label: "Collections", value: val(stats.collections),          testid: "stat-collections" },
    { icon: PhoneCall,         label: "Callbacks",   value: val(stats.callback_requests),    testid: "stat-callbacks", sub: "Pending" },
  ];

  return (
    <div className="p-8 lg:p-12" data-testid="admin-dashboard">

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#D4AF37]/10">
        <div className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mb-2">Overview</div>
        <h1 className="font-display text-4xl text-white">Dashboard</h1>
      </div>

      {/* Content stats */}
      <section className="mb-10">
        <div className="text-[9px] uppercase tracking-[0.28em] text-neutral-500 font-semibold mb-4">Content</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3">
          {contentStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* Analytics stats */}
      {analytics && (
        <section className="mb-10">
          <div className="text-[9px] uppercase tracking-[0.28em] text-neutral-500 font-semibold mb-4">Analytics — All Time</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard icon={Eye}           label="Product Views"   value={analytics.product_views  ?? 0} sub="Page Views" />
            <StatCard icon={MessageCircle} label="WhatsApp Clicks" value={analytics.whatsapp_clicks ?? 0} sub="Enquiries" />
            <StatCard icon={Phone}         label="Call Clicks"     value={analytics.call_clicks    ?? 0} sub="Calls" />
          </div>
        </section>
      )}

      {/* Top products */}
      {analytics?.top_products?.length > 0 && (
        <section className="mb-10">
          <div className="text-[9px] uppercase tracking-[0.28em] text-neutral-500 font-semibold mb-4">Top Viewed Products</div>
          <div className="bg-[#0e0e0e] border border-[#D4AF37]/15 rounded-xl p-6">
            <div className="space-y-3">
              {analytics.top_products.slice(0, 5).map((p, i) => (
                <div key={p.product_id || i} className="flex items-center justify-between py-2 border-b border-[#D4AF37]/8 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] w-5 text-neutral-600 font-semibold tabular-nums">{i + 1}</span>
                    <span className="text-sm text-neutral-300 font-light truncate max-w-xs">{p.product_name || p.product_id || `Product ${i + 1}`}</span>
                  </div>
                  <span className="text-[#D4AF37] font-display text-lg ml-4 tabular-nums">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick reference */}
      <section>
        <div className="bg-[#0e0e0e] border border-[#D4AF37]/15 rounded-xl p-8">
          <div className="text-[9px] uppercase tracking-[0.28em] text-neutral-500 font-semibold mb-3">Quick Reference</div>
          <h3 className="font-display text-2xl text-white mb-3">Manage your atelier</h3>
          <p className="text-neutral-400 font-light leading-relaxed max-w-2xl text-sm">
            Use the sidebar to manage homepage sliders, gift collections, individual products, gallery photos, and FAQs. All changes are reflected on the storefront instantly.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
