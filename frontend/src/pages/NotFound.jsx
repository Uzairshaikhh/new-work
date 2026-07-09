import { Link } from "react-router-dom";
import { Home, Search, MessageCircle } from "lucide-react";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { waLink } from "../lib/brand";

const NotFound = () => {
  useSEO({ title: "Page Not Found — Amazing Groups" });
  return (
    <div className="min-h-screen bg-[#0a0a0d] flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-lg">
          <div className="font-display text-[140px] md:text-[180px] leading-none text-[#d4af37]/10 select-none mb-2">
            404
          </div>
          <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-4">Page Not Found</div>
          <h1 className="font-display text-3xl md:text-4xl text-white mb-4">
            This gift is still being wrapped.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            The page you're looking for doesn't exist or has been moved. Let us help you find what you need.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" className="btn-amber !py-2.5 !px-6 !text-sm">
              <Home size={15} /> Back to Home
            </Link>
            <Link to="/products" className="btn-primary !py-2.5 !px-6 !text-sm">
              <Search size={15} /> Browse Products
            </Link>
            <a href={waLink("Hi Amazing Groups, I couldn't find a product on your website. Can you help?")} target="_blank" rel="noopener noreferrer" className="btn-ghost-gold !py-2.5 !px-6 !text-sm">
              <MessageCircle size={15} /> WhatsApp Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
