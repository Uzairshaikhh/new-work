import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { api } from "../lib/api";
import { waLink } from "../lib/brand";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import CategoryGrid from "../components/CategoryGrid";
import ProductCard from "../components/ProductCard";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import TrustedClients from "../components/TrustedClients";
import SocialLinks from "../components/SocialLinks";
import Testimonials from "../components/Testimonials";
import BulkPricing from "../components/BulkPricing";
import FAQ from "../components/FAQ";
import StatsCounter from "../components/StatsCounter";
import CollectionsSection from "../components/CollectionsSection";

const CACHE_KEY = "ag_home_v1";

const readCache = () => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { return null; }
};
const writeCache = (data) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
};

const Home = () => {
  const cache = readCache();
  const [sliders, setSliders] = useState(cache?.sliders || []);
  const [categories, setCategories] = useState(cache?.categories || []);
  const [featured, setFeatured] = useState(cache?.featured || []);
  const [settings, setSettings] = useState(cache?.settings || null);
  // Skip loading skeleton entirely when we have cached data to show immediately
  const [loading, setLoading] = useState(!cache);

  useSEO({
    title: "Amazing Groups | Complete Corporate & Personalized Gifting Manufacturer & Supplier",
    description: "Amazing Groups — India's trusted B2B gifting partner. Custom wallets, bottles, diaries & more. Premium quality, on-time delivery, pan-India reach.",
  });

  const fetchData = () => {
    let mounted = true;
    Promise.all([
      api.get("/sliders"),
      api.get("/categories"),
      api.get("/products?limit=5"),
      api.get("/settings"),
    ])
      .then(([s, c, p, st]) => {
        if (!mounted) return;
        setSliders(s.data);
        setCategories(c.data);
        setFeatured(p.data);
        setSettings(st.data);
        writeCache({ sliders: s.data, categories: c.data, featured: p.data, settings: st.data });
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  };

  useEffect(() => {
    const cleanup = fetchData();
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        // Clear stale cache so fresh API data is always written on next fetch
        try { localStorage.removeItem(CACHE_KEY); } catch {}
        fetchData();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cleanup?.();
      document.removeEventListener("visibilitychange", onVisible);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bulkCtaHref = waLink("Hi Amazing Groups, I'd like a bulk quote.");

  return (
    <div className="min-h-screen bg-[#0a0a0d]" data-testid="home-page">
      <Navbar />
      <HeroSlider slides={sliders} loading={loading} />
      <StatsCounter settings={settings} />

      {/* Categories */}
      <section id="categories" className="py-10 px-6 lg:px-10" data-testid="categories-section">
        <div className="max-w-[1280px] mx-auto">
          <SectionHeading title="Shop by Category" />
          <CategoryGrid categories={categories} loading={loading} />
        </div>
      </section>

      {/* Popular Products */}
      <section id="products" className="py-10 px-6 lg:px-10" data-testid="featured-section">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-xl md:text-2xl lg:text-3xl text-white leading-tight">
              Popular Corporate Products
            </h2>
            <Link to="/products" className="text-xs font-semibold text-amber-brand hover:underline flex items-center gap-1">
              View All Products →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#15151a] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-[#d4af37]/20 rounded-lg">
              <p className="text-gray-400 text-xs uppercase tracking-wider">No products yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Bulk Pricing + Customize + How to Order (single component) */}
      <BulkPricing settings={settings} />

<TrustedClients settings={settings} />
<SocialLinks settings={settings} />
<Testimonials settings={settings} />

      {/* CTA banner */}
      <section className="py-8 px-6 lg:px-10" data-testid="final-cta-section">
        <div className="max-w-[1280px] mx-auto bg-gradient-to-r from-[#15151a] via-[#1a1a22] to-[#15151a] border border-[#d4af37]/30 rounded-lg p-6 md:p-7 flex flex-col md:flex-row items-center gap-5">
          <div className="flex-1 text-center md:text-left">
            <div className="font-display text-xl md:text-2xl text-white leading-tight">
              Need Bulk Orders for Your Business?
            </div>
            <p className="text-sm text-gray-300 mt-1">
              Get the best deals on premium corporate gifts.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 justify-center">
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="btn-primary !py-2.5 !px-5 !text-sm"
              data-testid="final-cta-quote"
            >
              Get Instant Quote
            </button>
            <a href={bulkCtaHref} target="_blank" rel="noopener noreferrer" className="btn-amber !py-2.5 !px-5 !text-sm" data-testid="final-cta-whatsapp">
              <MessageCircle size={14} /> WhatsApp Now
            </a>
          </div>
        </div>
      </section>

      <CollectionsSection />
      <FAQ />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
