import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-[#D4AF37]/15 bg-[#070707] py-16 px-6 lg:px-10" data-testid="site-footer">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="font-display text-2xl gold-text tracking-[0.05em]">Amazing Groups</div>
          <div className="text-[10px] tracking-[0.45em] text-neutral-500 uppercase mt-2">
            Mumbai · Est. Bespoke
          </div>
          <p className="text-sm text-neutral-400 font-light mt-6 leading-relaxed max-w-xs">
            Customised gift products, handcrafted hampers, and corporate gifting — finished with the
            patience of an atelier.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-5">Navigation</div>
          <ul className="space-y-3 text-sm text-neutral-400 font-light">
            <li><Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link></li>
            <li><a href="/#categories" className="hover:text-[#D4AF37] transition-colors">Collections</a></li>
            <li><a href="/#products" className="hover:text-[#D4AF37] transition-colors">Featured</a></li>
            <li><a href="/#contact" className="hover:text-[#D4AF37] transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-5">Atelier</div>
          <ul className="space-y-3 text-sm text-neutral-400 font-light">
            <li><a href="tel:+918657211339" className="hover:text-[#D4AF37] transition-colors">+91 8657 211 339</a></li>
            <li><a href="mailto:amazinggroups51@gmail.com" className="hover:text-[#D4AF37] transition-colors break-words">amazinggroups51@gmail.com</a></li>
            <li className="text-neutral-400">Jogeshwari West, Mumbai</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-[#D4AF37]/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[10px] tracking-[0.3em] uppercase text-neutral-600">
          © {new Date().getFullYear()} Amazing Groups · All rights reserved
        </div>
        <div className="text-[10px] tracking-[0.3em] uppercase text-neutral-700">
          Crafted in Mumbai
        </div>
      </div>
    </footer>
  );
};

export default Footer;
