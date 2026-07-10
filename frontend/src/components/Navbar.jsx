import { useState, useEffect, useRef } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const megaRef = useRef(null);
  const megaTimer = useRef(null);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data.slice(0, 12))).catch(() => {});
  }, []);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMega = () => { clearTimeout(megaTimer.current); setMegaOpen(true); };
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 130); };

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
    <header
      data-testid="site-navbar"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0d]/90 backdrop-blur-xl shadow-[0_1px_0_rgba(212,175,55,0.12),0_8px_32px_rgba(0,0,0,0.4)]"
          : "bg-[#15151a]"
      }`}
    >
      {/* Utility bar */}
      <div className="bg-[#08080b] text-[11px] hidden md:block border-b border-[#d4af37]/8" data-testid="utility-bar">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-2.5 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-white/60">
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-[#d4af37]" /> GST Billing Available</div>
            <div className="flex items-center gap-1.5"><Package size={12} className="text-[#d4af37]" /> Bulk Orders Only</div>
            <div className="flex items-center gap-1.5"><Truck size={12} className="text-[#d4af37]" /> Pan India Delivery</div>
          </div>
          <div className="flex items-center gap-5 text-white/70">
            <a href={`tel:${BRAND.phoneTel}`} className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors">
              <Phone size={12} className="text-[#d4af37]" /> {BRAND.phoneDisplay}
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors">
              <MessageCircle size={12} className="text-[#d4af37]" /> WhatsApp Us
            </a>
            <a href={`mailto:${BRAND.email}`} className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors">
              <Mail size={12} className="text-[#d4af37]" /> {BRAND.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-[#d4af37]/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-3.5 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group" data-testid="brand-logo">
            <img src={BRAND.logoSrc} alt="Amazing Groups" className="w-11 h-11 rounded-lg object-cover shadow-md transition-transform duration-300 group-hover:scale-105" />
            <div>
              <div className="font-display text-base leading-none text-[#d4af37] tracking-tight">Amazing Groups</div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-white/35 mt-1 font-medium">Amazing Make You Happy</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.hash ? `/#${l.hash}` : l.to}
                onClick={(e) => handleNavClick(e, l.to, l.hash)}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                className="relative text-sm font-medium text-white/75 hover:text-white transition-colors duration-200 whitespace-nowrap py-1
                  after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#d4af37] after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            ))}

            {/* Categories mega trigger */}
            <div className="relative" ref={megaRef} onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button
                className="flex items-center gap-1 text-sm font-medium text-white/75 hover:text-white transition-colors duration-200 py-1"
                onClick={() => setMegaOpen((o) => !o)}
                aria-expanded={megaOpen}
              >
                Categories
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-300 text-[#d4af37]/60 ${megaOpen ? "rotate-180" : ""}`}
                />
              </button>

              {megaOpen && categories.length > 0 && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[580px] glass-dark border border-[#d4af37]/18 rounded-xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(212,175,55,0.06)] z-50 p-5
                    animate-fade-down origin-top"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  {/* Top gold line */}
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

                  <div className="text-[9px] uppercase tracking-[0.32em] text-[#d4af37] font-bold mb-4">Browse Collections</div>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.id}`}
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#d4af37]/6 border border-transparent hover:border-[#d4af37]/18 transition-all duration-200 group"
                      >
                        <img src={resolveMedia(cat.image_url, 80)} alt="" className="w-9 h-9 object-cover rounded-md flex-shrink-0 transition-transform duration-300 group-hover:scale-105" />
                        <span className="text-xs text-white/75 font-medium leading-snug group-hover:text-white transition-colors duration-200 line-clamp-2">{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#d4af37]/10 flex items-center justify-between">
                    <Link to="/products" onClick={() => setMegaOpen(false)} className="text-xs text-[#d4af37] hover:underline font-semibold">
                      View All Products →
                    </Link>
                    <Link to="/collections" onClick={() => setMegaOpen(false)} className="text-xs text-white/40 hover:text-[#d4af37] transition-colors">
                      Browse Collections →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            <button
              data-testid="nav-search-btn"
              onClick={() => setSearchOpen(true)}
              title="Search (⌘K)"
              className="hidden md:flex items-center gap-2 h-8 px-3 rounded-full border border-[#d4af37]/18 text-white/60 hover:border-[#d4af37]/50 hover:text-white transition-all duration-200 text-xs"
            >
              <Search size={13} strokeWidth={2} />
              <span className="text-white/30 text-[10px] hidden xl:flex items-center gap-0.5">
                <Command size={9} />K
              </span>
            </button>

            <a
              href={bulkOrderHref}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-bulk-order-btn"
              className="btn-amber hidden md:inline-flex !py-2 !px-4 !text-xs !rounded-lg"
            >
              Get Bulk Quote
            </a>

            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[#d4af37]/15 text-white/80 hover:border-[#d4af37]/40 hover:text-white transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              data-testid="mobile-menu-toggle"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden glass-dark border-b border-[#d4af37]/12 px-5 py-4 space-y-1 max-h-[80vh] overflow-y-auto animate-fade-down"
          data-testid="mobile-menu"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.hash ? `/#${l.hash}` : l.to}
              onClick={(e) => handleNavClick(e, l.to, l.hash)}
              className="block py-2.5 text-sm font-medium text-white/80 hover:text-[#d4af37] border-b border-[#d4af37]/8 last:border-0 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/collections"
            onClick={() => setMobileOpen(false)}
            className="block py-2.5 text-sm font-medium text-white/80 hover:text-[#d4af37] border-b border-[#d4af37]/8 transition-colors"
          >
            Collections
          </Link>

          {categories.length > 0 && (
            <div className="pt-3">
              <div className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-bold mb-3">Categories</div>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 8).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-[#d4af37]/12 hover:border-[#d4af37]/35 transition-colors"
                  >
                    <img src={resolveMedia(cat.image_url, 40)} alt="" className="w-7 h-7 object-cover rounded-md flex-shrink-0" />
                    <span className="text-xs text-white/80 line-clamp-1">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 space-y-2">
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
              className="block py-2.5 text-sm font-medium text-white/60 hover:text-[#d4af37] w-full text-left transition-colors"
            >
              Search (⌘K)
            </button>
            <a
              href={bulkOrderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full !py-3 !text-sm block text-center"
              data-testid="mobile-bulk-order-btn"
            >
              Get Bulk Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
