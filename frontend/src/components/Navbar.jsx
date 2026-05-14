import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, MessageCircle, Menu, X } from "lucide-react";
import SearchOverlay from "./SearchOverlay";

const WHATSAPP_NUMBER = "918657211339";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavClick = (e, to, hash) => {
    e.preventDefault();
    setMobileOpen(false);
    if (hash) {
      if (location.pathname === "/") {
        scrollToSection(hash);
      } else {
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
    { to: "/", label: "Contact", hash: "contact" },
  ];

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass border-b border-[#D4AF37]/20" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <nav className="hidden md:flex items-center gap-10 flex-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.hash ? `/#${l.hash}` : l.to}
              onClick={(e) => handleNavClick(e, l.to, l.hash)}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="text-[11px] uppercase tracking-[0.25em] text-neutral-300 hover:text-[#D4AF37] transition-colors duration-300 cursor-pointer"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          className="md:hidden text-neutral-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="mobile-menu-toggle"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex-shrink-0 mx-6" data-testid="brand-logo">
          <div className="text-center">
            <div className="font-display text-2xl lg:text-3xl tracking-[0.05em] gold-text leading-none">
              Amazing Groups
            </div>
            <div className="text-[9px] tracking-[0.45em] text-neutral-500 uppercase mt-1">
              Mumbai · Est. Bespoke
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-5 flex-1 justify-end">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hi Amazing Groups, I'd like to enquire about a BULK / CORPORATE order. Could you share details on pricing and lead times?"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="nav-bulk-order-btn"
            className="hidden lg:inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/40 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a0a0a] hover:border-[#D4AF37] transition-all duration-300 font-medium"
          >
            Bulk Order
          </a>
          <button
            data-testid="nav-search-btn"
            onClick={() => setSearchOpen(true)}
            className="text-neutral-300 hover:text-[#D4AF37] transition-colors"
            aria-label="Search"
          >
            <Search size={18} strokeWidth={1.4} />
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Amazing%20Groups`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="nav-whatsapp-btn"
            className="flex items-center gap-2 text-neutral-300 hover:text-[#D4AF37] transition-colors"
          >
            <MessageCircle size={18} strokeWidth={1.4} />
            <span className="text-[11px] uppercase tracking-[0.25em]">WhatsApp</span>
          </a>
        </div>
        <div className="md:hidden w-6" />
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {mobileOpen && (
        <div className="md:hidden glass border-t border-[#D4AF37]/20 px-6 py-6 space-y-5" data-testid="mobile-menu">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.hash ? `/#${l.hash}` : l.to}
              onClick={(e) => handleNavClick(e, l.to, l.hash)}
              className="block text-sm uppercase tracking-[0.25em] text-neutral-300 hover:text-[#D4AF37]"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hi Amazing Groups, I'd like to enquire about a BULK / CORPORATE order."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm uppercase tracking-[0.25em] gold-text"
            data-testid="mobile-bulk-order-btn"
          >
            Bulk Order
          </a>
          <button
            onClick={() => {
              setMobileOpen(false);
              setSearchOpen(true);
            }}
            className="block text-sm uppercase tracking-[0.25em] text-neutral-300 hover:text-[#D4AF37]"
          >
            Search
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm uppercase tracking-[0.25em] gold-text"
          >
            WhatsApp
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;
