import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { BRAND } from "../lib/brand";

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-16 pb-8 px-6 lg:px-10" data-testid="site-footer">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img src={BRAND.logoSrc} alt="Amazing Groups" className="w-12 h-12 rounded-md object-cover" />
            <div>
              <div className="font-display text-lg leading-none text-amber-brand">Amazing Groups</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 mt-1">{BRAND.tagline}</div>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed max-w-xs">
            India's trusted B2B gifting partner. Premium quality, on-time delivery and pan-India reach.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-amber-brand font-semibold mb-5">Navigation</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link to="/" className="hover:text-amber-brand transition-colors">Home</Link></li>
            <li><a href="/#categories" className="hover:text-amber-brand transition-colors">Categories</a></li>
            <li><a href="/#products" className="hover:text-amber-brand transition-colors">Products</a></li>
            <li><a href="/#how-to-order" className="hover:text-amber-brand transition-colors">How To Order</a></li>
            <li><Link to="/" className="hover:text-amber-brand transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-amber-brand font-semibold mb-5">Legal</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link to="/about-us" className="hover:text-amber-brand transition-colors">About Us</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-amber-brand transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-amber-brand transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-amber-brand font-semibold mb-5">Services</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li>Custom Printing</li>
            <li>Bulk Corporate Gifting</li>
            <li>Logo Branding</li>
            <li>Custom Packaging</li>
            <li>Pan-India Delivery</li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider text-amber-brand font-semibold mb-5">Contact</div>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-amber-brand" />
              <a href={`tel:${BRAND.phoneTel}`} className="hover:text-white">{BRAND.phoneDisplay}</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle size={14} className="text-amber-brand" />
              <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp Us</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={14} className="text-amber-brand mt-0.5" />
              <a href={`mailto:${BRAND.email}`} className="hover:text-white break-all">{BRAND.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-amber-brand mt-0.5" />
              <a href={BRAND.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {BRAND.locationLabel}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-xs text-white/50">© {new Date().getFullYear()} Amazing Groups · All rights reserved</div>
        <div className="text-xs text-white/40">Crafted with care in Mumbai</div>
      </div>
    </footer>
  );
};

export default Footer;
