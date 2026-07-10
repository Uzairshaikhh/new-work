import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";
import { BRAND } from "../lib/brand";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "All Products", to: "/products" },
  { label: "Gallery", to: "/gallery" },
  { label: "Collections", to: "/collections" },
  { label: "Corporate Gifting", to: "/corporate" },
  { label: "Contact", to: "/#contact" },
];

const LEGAL_LINKS = [
  { label: "About Us", to: "/about-us" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
];

const SERVICES = [
  "Custom Logo Printing",
  "Bulk Corporate Gifting",
  "Premium Branding",
  "Custom Packaging",
  "Pan-India Delivery",
  "GST Billing",
];

const SOCIAL = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Facebook,  label: "Facebook",  href: "https://facebook.com" },
  { icon: Linkedin,  label: "LinkedIn",  href: "https://linkedin.com" },
  { icon: Youtube,   label: "YouTube",   href: "https://youtube.com" },
];

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-[#d4af37]/12" data-testid="site-footer">
    {/* Ambient background */}
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] opacity-[0.04] blur-3xl rounded-full"
        style={{ background: "radial-gradient(circle, #d4af37 0%, transparent 70%)" }}
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0d] via-[#080808] to-[#050508] pointer-events-none" />

    {/* Top gold line */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/35 to-transparent" />

    <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 pb-8">

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-10 xl:gap-12 mb-14">

        {/* Brand column */}
        <div className="xl:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-5 group w-fit">
            <img
              src={BRAND.logoSrc}
              alt="Amazing Groups"
              className="w-12 h-12 rounded-xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <div className="font-display text-lg leading-none text-[#d4af37]">Amazing Groups</div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-white/35 mt-1 font-medium">{BRAND.tagline}</div>
            </div>
          </Link>

          <p className="text-sm text-white/50 leading-relaxed max-w-sm mb-6">
            India's trusted B2B corporate gifting partner. Premium-quality customized gifts, expert branding, bulk order support, and reliable pan-India delivery — helping brands create lasting impressions.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2.5">
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-lg border border-[#d4af37]/15 flex items-center justify-center text-white/40 hover:text-[#d4af37] hover:border-[#d4af37]/45 hover:bg-[#d4af37]/6 transition-all duration-250"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <div className="text-[9px] uppercase tracking-[0.32em] text-[#d4af37] font-bold mb-5">Navigation</div>
          <ul className="space-y-2.5">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-white/50 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <div className="text-[9px] uppercase tracking-[0.32em] text-[#d4af37] font-bold mb-5">Services</div>
          <ul className="space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s} className="text-sm text-white/50">{s}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="text-[9px] uppercase tracking-[0.32em] text-[#d4af37] font-bold mb-5">Contact Us</div>
          <ul className="space-y-3.5">
            <li>
              <a
                href={`tel:${BRAND.phoneTel}`}
                className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors group"
              >
                <span className="w-7 h-7 rounded-lg bg-[#d4af37]/8 flex items-center justify-center flex-shrink-0 border border-[#d4af37]/15 group-hover:border-[#d4af37]/35 transition-colors">
                  <Phone size={12} className="text-[#d4af37]" />
                </span>
                {BRAND.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors group"
              >
                <span className="w-7 h-7 rounded-lg bg-[#d4af37]/8 flex items-center justify-center flex-shrink-0 border border-[#d4af37]/15 group-hover:border-[#d4af37]/35 transition-colors">
                  <MessageCircle size={12} className="text-[#d4af37]" />
                </span>
                WhatsApp Us
              </a>
            </li>
            <li>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors group"
              >
                <span className="w-7 h-7 rounded-lg bg-[#d4af37]/8 flex items-center justify-center flex-shrink-0 border border-[#d4af37]/15 group-hover:border-[#d4af37]/35 transition-colors">
                  <Mail size={12} className="text-[#d4af37]" />
                </span>
                <span className="break-all">{BRAND.email}</span>
              </a>
            </li>
            <li>
              <a
                href={BRAND.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-sm text-white/50 hover:text-white transition-colors group"
              >
                <span className="w-7 h-7 rounded-lg bg-[#d4af37]/8 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#d4af37]/15 group-hover:border-[#d4af37]/35 transition-colors">
                  <MapPin size={12} className="text-[#d4af37]" />
                </span>
                {BRAND.locationLabel}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/15 to-transparent mb-7" />

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-white/30">
          © {new Date().getFullYear()} Amazing Groups · All rights reserved
        </div>
        <div className="flex items-center gap-5">
          {LEGAL_LINKS.map(({ label, to }) => (
            <Link key={label} to={to} className="text-xs text-white/30 hover:text-[#d4af37] transition-colors">
              {label}
            </Link>
          ))}
        </div>
        <div className="text-xs text-white/20">Crafted with care in Mumbai</div>
      </div>
    </div>
  </footer>
);

export default Footer;
