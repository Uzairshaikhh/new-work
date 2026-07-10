import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";
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
const readCache  = () => { try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { return null; } };
const writeCache = (data) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {} };

/* Lightweight scroll-reveal watcher mounted once for the whole page */
const usePageReveal = () => {
  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("is-visible"); observer.unobserve(e.target); }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
};

const Home = () => {
  const cache = readCache();
  const [sliders,    setSliders]    = useState(cache?.sliders   || []);
  const [categories, setCategories] = useState(cache?.categories || []);
  const [featured,   setFeatured]   = useState(cache?.featured   || []);
  const [settings,   setSettings]   = useState(cache?.settings   || null);
  const [loading,    setLoading]    = useState(!cache);

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

  usePageReveal();

  const bulkCtaHref = waLink("Hi Amazing Groups, I'd like a bulk quote.");

  return (
    <div className="min-h-screen bg-[#0a0a0d]" data-testid="home-page">
      <Navbar />
      <HeroSlider slides={sliders} loading={loading} />
      <StatsCounter settings={settings} />

      {/* ── Categories ─────────────────────────────── */}
      <section
        id="categories"
        className="py-14 px-6 lg:px-10"
        data-testid="categories-section"
      >
        <div className="max-w-[1280px] mx-auto">
          <SectionHeading
            eyebrow="Browse"
            title="Shop by Category"
            subtitle="Explore our wide range of premium gift categories, each curated for corporate excellence."
          />
          <CategoryGrid categories={categories} loading={loading} />
        </div>
      </section>

      {/* ── Popular Products ────────────────────────── */}
      <section
        id="products"
        className="py-14 px-6 lg:px-10 relative section-glow-top"
        style={{ background: "linear-gradient(180deg, #0e0e13 0%, #0a0a0d 100%)" }}
        data-testid="featured-section"
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between mb-8 reveal">
            <div>
              <div className="eyebrow mb-2">Featured</div>
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-white leading-tight">
                Popular Corporate Products
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#d4af37] hover:text-white transition-colors group"
            >
              View All
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#15151a] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#d4af37]/18 rounded-xl">
              <p className="text-white/30 text-xs uppercase tracking-[0.25em]">No products yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {featured.map((p, i) => (
                <div
                  key={p.id}
                  className="reveal"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="btn-amber !py-2.5 !px-6 !text-sm">
              View All Products <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bulk Pricing + How to Order ─────────────── */}
      <BulkPricing settings={settings} />

      {/* ── Trusted Clients ─────────────────────────── */}
      <TrustedClients settings={settings} />

      {/* ── Social Links ────────────────────────────── */}
      <SocialLinks settings={settings} />

      {/* ── Testimonials ────────────────────────────── */}
      <Testimonials settings={settings} />

      {/* ── Collections ─────────────────────────────── */}
      <CollectionsSection />

      {/* ── Premium CTA Banner ──────────────────────── */}
      <section className="py-10 px-6 lg:px-10" data-testid="final-cta-section">
        <div className="max-w-[1280px] mx-auto">
          <div
            className="relative overflow-hidden rounded-2xl border border-[#d4af37]/20 p-8 md:p-12 text-center md:text-left reveal"
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 80% 50%, rgba(212,175,55,0.07), transparent 60%)," +
                "linear-gradient(135deg, #15151a 0%, #0e0e13 100%)",
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                  <Sparkles size={14} className="text-[#d4af37]" />
                  <span className="eyebrow">Ready to Start?</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-white mb-3 leading-tight">
                  Need Bulk Orders for Your Business?
                </h2>
                <p className="text-white/50 text-sm leading-relaxed max-w-md">
                  Get the best deals on premium corporate gifts. Share your brief and receive a personalised quote within 2 hours.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="btn-primary !py-3 !px-7"
                  data-testid="final-cta-quote"
                >
                  Get Instant Quote
                </button>
                <a
                  href={bulkCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-amber !py-3 !px-7"
                  data-testid="final-cta-whatsapp"
                >
                  <MessageCircle size={15} /> WhatsApp Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <FAQ />

      {/* ── Contact ──────────────────────────────────── */}
      <ContactSection />

      <Footer />
    </div>
  );
};

export default Home;
