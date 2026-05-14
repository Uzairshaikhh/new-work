import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { api } from "../lib/api";
import { waLink } from "../lib/brand";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import CategoryGrid from "../components/CategoryGrid";
import ProductCard from "../components/ProductCard";
import ContactSection, { HowToOrderSection } from "../components/ContactSection";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import TrustedClients from "../components/TrustedClients";
import Testimonials from "../components/Testimonials";
import BulkPricing from "../components/BulkPricing";

const Home = () => {
  const [sliders, setSliders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: "Premium Corporate Gifts with Your Brand Identity",
    description: "Amazing Groups — India's trusted B2B gifting partner. Custom wallets, bottles, diaries & more. Premium quality, on-time delivery, pan-India reach.",
  });

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get("/sliders"),
      api.get("/categories"),
      api.get("/products"),
    ])
      .then(([s, c, p]) => {
        if (!mounted) return;
        setSliders(s.data);
        setCategories(c.data);
        // show all products as "popular" — first 8
        setFeatured(p.data.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const bulkCtaHref = waLink("Hi Amazing Groups, I'd like a bulk quote.");

  return (
    <div className="min-h-screen bg-white" data-testid="home-page">
      <Navbar />
      <HeroSlider slides={sliders} loading={loading} />

      <section id="categories" className="py-20 md:py-28 px-6 lg:px-10 bg-cream-soft" data-testid="categories-section">
        <div className="max-w-[1400px] mx-auto">
          <SectionHeading
            eyebrow="Shop By Category"
            title="Premium gifts, every occasion"
            subtitle="Each category is curated for corporate gifting — wallets, diaries, bottles, mugs and bespoke sets."
          />
          <CategoryGrid categories={categories} loading={loading} />
        </div>
      </section>

      <section id="products" className="py-20 md:py-28 px-6 lg:px-10 bg-white" data-testid="featured-section">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">
                Popular Picks
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-navy leading-[1.15]">
                Popular corporate products
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-500 text-sm uppercase tracking-wider">No products yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <BulkPricing />
      <HowToOrderSection />
      <TrustedClients />
      <Testimonials />

      {/* Final CTA */}
      <section className="py-20 md:py-24 px-6 lg:px-10 bg-navy text-white" data-testid="final-cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-4">
            Ready to start?
          </div>
          <h2 className="font-display text-3xl md:text-5xl text-white leading-[1.1] mb-6">
            Need bulk orders for your business?
          </h2>
          <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto mb-10">
            Get the best deals on premium corporate gifts — branded, packaged and delivered.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={bulkCtaHref} target="_blank" rel="noopener noreferrer" className="btn-amber" data-testid="final-cta-whatsapp">
              <MessageCircle size={16} /> WhatsApp Now
            </a>
            <a href="#contact" className="btn-outline !bg-transparent !text-white !border-white/30 hover:!text-amber-brand hover:!border-amber-brand">
              Contact Us <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
