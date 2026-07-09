import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Images, FolderTree, Package, HelpCircle, GalleryHorizontal, MessageCircle, Phone, Eye } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, testid, sub }) => (
  <div className="bg-[#0e0e0e] border border-[#D4AF37]/15 p-8 hover:border-[#D4AF37]/40 transition-all duration-500" data-testid={testid}>
    <Icon size={22} strokeWidth={1.3} className="text-[#D4AF37] mb-6" />
    <div className="eyebrow mb-3">{label}</div>
    <div className="font-display text-5xl text-white">{value}</div>
    {sub && <div className="text-[10px] text-neutral-600 uppercase tracking-wider mt-2">{sub}</div>}
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

  return (
    <div className="p-10 lg:p-14" data-testid="admin-dashboard">
      <div className="mb-12">
        <div className="eyebrow mb-3">Overview</div>
        <h1 className="font-display text-4xl md:text-5xl text-white">Dashboard</h1>
      </div>

      {/* Content stats */}
      <div className="eyebrow mb-4 text-neutral-500">Content</div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <StatCard icon={Images}            label="Sliders"    value={val(stats.sliders)}    testid="stat-sliders" />
        <StatCard icon={FolderTree}        label="Categories" value={val(stats.categories)}  testid="stat-categories" />
        <StatCard icon={Package}           label="Products"   value={val(stats.products)}    testid="stat-products" />
        <StatCard icon={HelpCircle}        label="FAQs"       value={val(stats.faqs)}        testid="stat-faqs" />
        <StatCard icon={GalleryHorizontal} label="Gallery"    value={val(stats.gallery)}     testid="stat-gallery" />
      </div>

      {/* Analytics stats */}
      {analytics && (
        <>
          <div className="eyebrow mb-4 text-neutral-500">Analytics — All Time</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            <StatCard icon={Eye}           label="Product Views"   value={analytics.product_views  ?? 0} sub="total page views" />
            <StatCard icon={MessageCircle} label="WhatsApp Clicks" value={analytics.whatsapp_clicks ?? 0} sub="enquiries started" />
            <StatCard icon={Phone}         label="Call Clicks"     value={analytics.call_clicks    ?? 0} sub="calls initiated" />
          </div>
          {analytics.top_products?.length > 0 && (
            <div className="mb-10 border border-[#D4AF37]/15 bg-[#0e0e0e] p-8">
              <div className="eyebrow mb-5">Top Viewed Products</div>
              <div className="space-y-3">
                {analytics.top_products.slice(0, 5).map((p, i) => (
                  <div key={p.product_id || i} className="flex items-center justify-between">
                    <span className="text-sm text-neutral-300 font-light truncate max-w-[70%]">{p.product_name || p.product_id || `Product ${i + 1}`}</span>
                    <span className="text-amber-brand font-display text-lg ml-4">{p.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-4 p-10 border border-[#D4AF37]/15 bg-[#0e0e0e]">
        <div className="eyebrow mb-4">Quick Reference</div>
        <h3 className="font-display text-2xl text-white mb-4">Manage your atelier</h3>
        <p className="text-neutral-400 font-light leading-relaxed max-w-2xl">
          Use the sidebar to manage homepage sliders, gift collections, individual products, gallery photos, and FAQs. All changes are reflected on the storefront instantly.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
