import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, MessageCircle, Menu, X, Phone, Mail, ShieldCheck, Truck, Package } from "lucide-react";
import SearchOverlay from "./SearchOverlay";
import { BRAND, waLink } from "../lib/brand";

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

  const bulkOrderHref = waLink(
    "Hi Amazing Groups, I'd like a bulk / corporate quote. Could you share details on pricing and lead times?"
  );

  return (
    <header data-testid="site-navbar" className="sticky top-0 z-50 bg-[#15151a]">
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
            <a href={`tel:${BRAND.phoneTel}`} className="flex items-center gap-1.5 hover:text-amber-brand transition-colors">
              <Phone size={13} className="text-amber-brand" /> {BRAND.phoneDisplay}
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-brand transition-colors"
            >
              <MessageCircle size={13} className="text-amber-brand" /> WhatsApp Us
            </a>
            <a href={`mailto:${BRAND.email}`} className="flex items-center gap-1.5 hover:text-amber-brand transition-colors">
              <Mail size={13} className="text-amber-brand" /> {BRAND.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-[#d4af37]/15 bg-[#15151a]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3" data-testid="brand-logo">
            <img
              src={BRAND.logoSrc}
              alt="Amazing Groups"
              className="w-12 h-12 rounded-md object-cover shadow-md"
            />
            <div>
              <div className="font-display text-lg leading-none text-white">Amazing Groups</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mt-1">
                Amazing Make You Happy
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
                className="text-sm font-medium text-white hover:text-amber-brand transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              data-testid="nav-search-btn"
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-full border border-[#d4af37]/20 text-white hover:border-amber-brand hover:text-amber-brand transition-colors"
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
              className="lg:hidden text-white"
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
        <div className="lg:hidden bg-[#15151a] border-b border-[#d4af37]/15 px-6 py-5 space-y-3" data-testid="mobile-menu">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.hash ? `/#${l.hash}` : l.to}
              onClick={(e) => handleNavClick(e, l.to, l.hash)}
              className="block py-2 text-sm font-medium text-white hover:text-amber-brand"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              setSearchOpen(true);
            }}
            className="block py-2 text-sm font-medium text-white hover:text-amber-brand"
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
