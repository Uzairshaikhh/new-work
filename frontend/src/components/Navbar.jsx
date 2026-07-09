import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, MessageCircle, Menu, X, Phone, Mail, ShieldCheck, Truck, Package, ChevronDown, Command } from "lucide-react";
import SearchOverlay from "./SearchOverlay";
import { api, resolveMedia } from "../lib/api";
import { BRAND, waLink } from "../lib/brand";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const megaRef = useRef(null);
  const megaTimer = useRef(null);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data.slice(0, 12))).catch(() => {});
  }, []);

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openMega = () => { clearTimeout(megaTimer.current); setMegaOpen(true); };
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 120); };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNavClick = (e, to, hash) => {
    e.preventDefault();
    setMobileOpen(false);
    if (hash) {
      if (location.pathname === "/") scrollToSection(hash);
      else { navigate("/"); setTimeout(() => scrollToSection(hash), 250); }
    } else {
      navigate(to);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const links = [
    { to: "/", label: "Home", hash: null },
    { to: "/about-us", label: "About Us", hash: null },
    { to: "/products", label: "Products", hash: null },
    { to: "/gallery", label: "Gallery", hash: null },
    { to: "/corporate", label: "Corporate", hash: null },
    { to: "/", label: "Contact", hash: "contact" },
  ];

  const bulkOrderHref = waLink("Hi Amazing Groups, I'd like a bulk / corporate quote. Could you share details on pricing and lead times?");

  return (
    <header data-testid="site-navbar" className="sticky top-0 z-50 bg-[#15151a]">
      {/* Top utility bar */}
      <div className="bg-navy text-white text-[11px] md:text-xs hidden md:block" data-testid="utility-bar">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-2.5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-white/80">
            <div className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-amber-brand" /> GST Billing Available</div>
            <div className="flex items-center gap-1.5"><Package size={13} className="text-amber-brand" /> Bulk Orders Only</div>
            <div className="flex items-center gap-1.5"><Truck size={13} className="text-amber-brand" /> Pan India Delivery</div>
          </div>
          <div className="flex items-center gap-5 text-white/90">
            <a href={`tel:${BRAND.phoneTel}`} className="flex items-center gap-1.5 hover:text-amber-brand transition-colors">
              <Phone size={13} className="text-amber-brand" /> {BRAND.phoneDisplay}
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-amber-brand transition-colors">
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
          <Link to="/" className="flex items-center gap-3 flex-shrink-0" data-testid="brand-logo">
            <img src={BRAND.logoSrc} alt="Amazing Groups" className="w-12 h-12 rounded-md object-cover shadow-md" />
            <div>
              <div className="font-display text-lg leading-none text-amber-brand">Amazing Groups</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500 mt-1">Amazing Make You Happy</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <a key={l.label} href={l.hash ? `/#${l.hash}` : l.to} onClick={(e) => handleNavClick(e, l.to, l.hash)}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-white hover:text-amber-brand transition-colors whitespace-nowrap">
                {l.label}
              </a>
            ))}

            {/* Categories mega trigger */}
            <div className="relative" ref={megaRef} onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button
                className="flex items-center gap-1 text-sm font-medium text-white hover:text-amber-brand transition-colors"
                onClick={() => setMegaOpen((o) => !o)}
              >
                Categories <ChevronDown size={13} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </button>

              {megaOpen && categories.length > 0 && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[560px] bg-[#0e0e0e] border border-[#d4af37]/20 shadow-2xl z-50 p-5"
                  onMouseEnter={openMega} onMouseLeave={closeMega}
                >
                  <div className="text-[9px] uppercase tracking-[0.3em] text-amber-brand font-semibold mb-4">Browse Collections</div>
                  <div className="grid grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <Link key={cat.id} to={`/category/${cat.id}`} onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#15151a] border border-transparent hover:border-[#d4af37]/20 transition-all group">
                        <img src={resolveMedia(cat.image_url, 80)} alt="" className="w-10 h-10 object-cover rounded-md flex-shrink-0" />
                        <span className="text-xs text-white font-medium leading-tight group-hover:text-amber-brand transition-colors line-clamp-2">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#d4af37]/10 flex items-center justify-between">
                    <Link to="/products" onClick={() => setMegaOpen(false)} className="text-xs text-amber-brand hover:underline font-medium">
                      View All Products →
                    </Link>
                    <Link to="/collections" onClick={() => setMegaOpen(false)} className="text-xs text-gray-500 hover:text-amber-brand transition-colors">
                      Browse Collections →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <button
              data-testid="nav-search-btn"
              onClick={() => setSearchOpen(true)}
              title="Search (⌘K)"
              className="hidden md:flex items-center gap-2 h-9 px-3 rounded-full border border-[#d4af37]/20 text-white hover:border-amber-brand hover:text-amber-brand transition-colors text-xs"
            >
              <Search size={14} strokeWidth={2} />
              <span className="text-gray-600 text-[10px] hidden xl:flex items-center gap-0.5">
                <Command size={10} />K
              </span>
            </button>
            <a href={bulkOrderHref} target="_blank" rel="noopener noreferrer" data-testid="nav-bulk-order-btn" className="btn-amber hidden md:inline-flex !py-2.5 !px-4 !text-sm">
              Get Bulk Quote
            </a>
            <button className="lg:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)} data-testid="mobile-menu-toggle">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {mobileOpen && (
        <div className="lg:hidden bg-[#15151a] border-b border-[#d4af37]/15 px-6 py-5 space-y-1 max-h-[80vh] overflow-y-auto" data-testid="mobile-menu">
          {links.map((l) => (
            <a key={l.label} href={l.hash ? `/#${l.hash}` : l.to} onClick={(e) => handleNavClick(e, l.to, l.hash)}
              className="block py-2.5 text-sm font-medium text-white hover:text-amber-brand border-b border-[#d4af37]/10 last:border-0">
              {l.label}
            </a>
          ))}
          <Link to="/collections" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-white hover:text-amber-brand border-b border-[#d4af37]/10">
            Collections
          </Link>
          {categories.length > 0 && (
            <div className="pt-2">
              <div className="text-[9px] uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">Categories</div>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 8).map((cat) => (
                  <Link key={cat.id} to={`/category/${cat.id}`} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 p-2 rounded border border-[#d4af37]/15 hover:border-amber-brand/40 transition-colors">
                    <img src={resolveMedia(cat.image_url, 40)} alt="" className="w-7 h-7 object-cover rounded" />
                    <span className="text-xs text-white line-clamp-1">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => { setMobileOpen(false); setSearchOpen(true); }} className="block py-2.5 text-sm font-medium text-white hover:text-amber-brand w-full text-left">
            Search (⌘K)
          </button>
          <a href={bulkOrderHref} target="_blank" rel="noopener noreferrer" className="btn-amber w-full !py-3 mt-2 block text-center" data-testid="mobile-bulk-order-btn">
            Get Bulk Quote
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
