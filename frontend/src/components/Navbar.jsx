import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, MessageCircle, Menu, X, Phone, Mail, ShieldCheck, Truck, Package } from "lucide-react";
import SearchOverlay from "./SearchOverlay";

const WHATSAPP = "918657211339";
const PHONE_DISPLAY = "+91 8657 211 339";
const EMAIL = "amazinggroups51@gmail.com";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNavClick = (e, to, hash) => {
    e.preventDefault();
    setMobileOpen(false);
    if (hash) {
      if (location.pathname === "/") scrollToSection(hash);
      else {
        navigate("/");
        setTimeout(() => scrollToSection(hash), 250);
      }
    } else {
      navigate(to);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const links = [
    { to: "/", label: "Home", hash: null },
    { to: "/", label: "Categories", hash: "categories" },
    { to: "/", label: "Products", hash: "products" },
    { to: "/", label: "How To Order", hash: "how-to-order" },
    { to: "/", label: "Contact", hash: "contact" },
  ];

  const bulkOrderHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "Hi Amazing Groups, I'd like a bulk / corporate quote. Could you share details on pricing and lead times?"
  )}`;

  return (
    <header data-testid="site-navbar" className="sticky top-0 z-50 bg-white">
      {/* Top utility bar */}
      <div className="bg-navy text-white text-[11px] md:text-xs hidden md:block" data-testid="utility-bar">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-2.5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-white/80">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-amber-brand" />
              GST Billing Available
            </div>
            <div className="flex items-center gap-1.5">
              <Package size={13} className="text-amber-brand" />
              Bulk Orders Only
            </div>
            <div className="flex items-center gap-1.5">
              <Truck size={13} className="text-amber-brand" />
              Pan India Delivery
            </div>
          </div>
          <div className="flex items-center gap-5 text-white/90">
            <a href={`tel:${WHATSAPP}`} className="flex items-center gap-1.5 hover:text-amber-brand transition-colors">
              <Phone size={13} className="text-amber-brand" /> {PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-brand transition-colors"
            >
              <MessageCircle size={13} className="text-amber-brand" /> WhatsApp Us
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 hover:text-amber-brand transition-colors">
              <Mail size={13} className="text-amber-brand" /> {EMAIL}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3" data-testid="brand-logo">
            <div className="w-11 h-11 bg-navy text-amber-brand flex items-center justify-center rounded-md font-display text-xl shadow-md">
              AG
            </div>
            <div>
              <div className="font-display text-lg leading-none text-navy">Amazing Groups</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mt-1">
                Corporate Gifting Solutions
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.hash ? `/#${l.hash}` : l.to}
                onClick={(e) => handleNavClick(e, l.to, l.hash)}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-navy hover:text-amber-brand transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              data-testid="nav-search-btn"
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-full border border-gray-200 text-navy hover:border-amber-brand hover:text-amber-brand transition-colors"
              aria-label="Search"
            >
              <Search size={16} strokeWidth={2} />
            </button>
            <a
              href={bulkOrderHref}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-bulk-order-btn"
              className="btn-amber hidden md:inline-flex !py-2.5 !px-4 !text-sm"
            >
              Get Bulk Quote
            </a>
            <button
              className="lg:hidden text-navy"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="mobile-menu-toggle"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-6 py-5 space-y-3" data-testid="mobile-menu">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.hash ? `/#${l.hash}` : l.to}
              onClick={(e) => handleNavClick(e, l.to, l.hash)}
              className="block py-2 text-sm font-medium text-navy hover:text-amber-brand"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              setSearchOpen(true);
            }}
            className="block py-2 text-sm font-medium text-navy hover:text-amber-brand"
          >
            Search
          </button>
          <a href={bulkOrderHref} target="_blank" rel="noopener noreferrer" className="btn-amber w-full !py-3" data-testid="mobile-bulk-order-btn">
            Get Bulk Quote
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
