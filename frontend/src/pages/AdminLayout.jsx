import { Link, NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, Images, FolderTree, Package, Settings, LogOut, HelpCircle, GalleryHorizontal, Layers, Megaphone, Phone, Building2 } from "lucide-react";

const AdminLayout = () => {
  const { admin, checking, logout } = useAuth();
  const navigate = useNavigate();

  if (checking) return <div className="min-h-screen bg-[#0a0a0a]" />;
  if (!admin) return <Navigate to="/admin-x9k2l-secret" replace />;

  const navItems = [
  { to: "/admin-x9k2l-secret/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin-x9k2l-secret/sliders", icon: Images, label: "Sliders" },
  { to: "/admin-x9k2l-secret/categories", icon: FolderTree, label: "Categories" },
  { to: "/admin-x9k2l-secret/subcategories", icon: FolderTree, label: "Subcategories" },
  { to: "/admin-x9k2l-secret/products", icon: Package, label: "Products" },
  { to: "/admin-x9k2l-secret/faqs", icon: HelpCircle, label: "FAQs" },
  { to: "/admin-x9k2l-secret/gallery", icon: GalleryHorizontal, label: "Gallery" },
  { to: "/admin-x9k2l-secret/collections", icon: Layers, label: "Collections" },
  { to: "/admin-x9k2l-secret/callbacks", icon: Phone, label: "Callbacks" },
  { to: "/admin-x9k2l-secret/corporate", icon: Building2, label: "Corporate" },
  { to: "/admin-x9k2l-secret/popup", icon: Megaphone, label: "Popup" },
  { to: "/admin-x9k2l-secret/settings", icon: Settings, label: "Settings" },
];

  const onLogout = () => {
    logout();
    navigate("/admin-x9k2l-secret");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex" data-testid="admin-layout">
      <aside className="w-64 border-r border-[#D4AF37]/15 bg-[#080808] flex flex-col" data-testid="admin-sidebar">
        <Link to="/" className="block p-6 border-b border-[#D4AF37]/15">
          <div className="flex items-center gap-3">
            <img src="/ag-logo.png" alt="Amazing Groups" className="w-11 h-11 rounded-md object-cover" />
            <div>
              <div className="font-display text-base gold-text leading-none">Amazing Groups</div>
              <div className="text-[9px] tracking-[0.4em] text-neutral-500 uppercase mt-1">Atelier Console</div>
            </div>
          </div>
        </Link>
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.25em] transition-all ${
                    isActive
                      ? "bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]"
                      : "text-neutral-400 hover:text-white border-l-2 border-transparent"
                  }`
                }
                data-testid={`admin-nav-${it.label.toLowerCase()}`}
              >
                <Icon size={16} strokeWidth={1.4} />
                {it.label}
              </NavLink>
            );
          })}
        </nav>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-8 py-5 border-t border-[#D4AF37]/15 text-[11px] uppercase tracking-[0.25em] text-neutral-400 hover:text-[#D4AF37] transition-colors"
          data-testid="admin-logout-btn"
        >
          <LogOut size={16} strokeWidth={1.4} />
          Sign Out
        </button>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
