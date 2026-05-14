import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Images, FolderTree, Package } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, testid }) => (
  <div
    className="bg-[#0e0e0e] border border-[#D4AF37]/15 p-8 hover:border-[#D4AF37]/40 transition-all duration-500"
    data-testid={testid}
  >
    <Icon size={22} strokeWidth={1.3} className="text-[#D4AF37] mb-6" />
    <div className="eyebrow mb-3">{label}</div>
    <div className="font-display text-5xl text-white">{value}</div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ categories: 0, products: 0, sliders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-10 lg:p-14" data-testid="admin-dashboard">
      <div className="mb-12">
        <div className="eyebrow mb-3">Overview</div>
        <h1 className="font-display text-4xl md:text-5xl text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Images}
          label="Hero Sliders"
          value={loading ? "—" : stats.sliders}
          testid="stat-sliders"
        />
        <StatCard
          icon={FolderTree}
          label="Collections"
          value={loading ? "—" : stats.categories}
          testid="stat-categories"
        />
        <StatCard
          icon={Package}
          label="Products"
          value={loading ? "—" : stats.products}
          testid="stat-products"
        />
      </div>

      <div className="mt-16 p-10 border border-[#D4AF37]/15 bg-[#0e0e0e]">
        <div className="eyebrow mb-4">Quick Reference</div>
        <h3 className="font-display text-2xl text-white mb-4">Manage your atelier</h3>
        <p className="text-neutral-400 font-light leading-relaxed max-w-2xl">
          Use the sidebar to manage homepage sliders, gift collections, and individual products. All
          changes are reflected on the storefront instantly.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
