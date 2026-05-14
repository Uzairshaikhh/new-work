import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-white pt-16 pb-8 px-6 lg:px-10" data-testid="site-footer">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 bg-white text-navy flex items-center justify-center rounded-md font-display text-xl">AG</div>
            <div>
              <div className="font-display text-lg leading-none">Amazing Groups</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 mt-1">Corporate Gifting</div>
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
            <li className="flex items-center gap-2"><Phone size={14} className="text-amber-brand" /> <a href="tel:+918657211339" className="hover:text-white">+91 8657 211 339</a></li>
            <li className="flex items-center gap-2"><MessageCircle size={14} className="text-amber-brand" /> <a href="https://wa.me/918657211339" target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp Us</a></li>
            <li className="flex items-start gap-2"><Mail size={14} className="text-amber-brand mt-0.5" /> <a href="mailto:amazinggroups51@gmail.com" className="hover:text-white break-all">amazinggroups51@gmail.com</a></li>
            <li className="flex items-start gap-2"><MapPin size={14} className="text-amber-brand mt-0.5" /> Jogeshwari West, Mumbai</li>
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
