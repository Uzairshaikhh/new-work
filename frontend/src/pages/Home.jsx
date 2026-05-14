import { useEffect, useState } from "react";
import { api } from "../lib/api";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import CategoryGrid from "../components/CategoryGrid";
import ProductCard from "../components/ProductCard";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";

const Home = () => {
  const [sliders, setSliders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: "Bespoke Gifts, Crafted With Intention",
    description: "Amazing Groups — handcrafted hampers, personalised keepsakes and luxury corporate gifting from Mumbai.",
  });

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.get("/sliders"),
      api.get("/categories"),
      api.get("/products", { params: { featured: true } }),
    ])
      .then(([s, c, p]) => {
        if (!mounted) return;
        setSliders(s.data);
        setCategories(c.data);
        setFeatured(p.data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]" data-testid="home-page">
      <Navbar />
      <HeroSlider slides={sliders} loading={loading} />

      <section
        id="categories"
        className="relative py-24 md:py-32 px-6 lg:px-10 grain"
        data-testid="categories-section"
      >
        <div className="max-w-[1400px] mx-auto">
          <SectionHeading
            eyebrow="Curated Collections"
            title="Explore our atelier"
            subtitle="Each collection is shaped by the occasions they were made for — from quiet anniversaries to grand corporate moments."
          />
          <CategoryGrid categories={categories} loading={loading} />
        </div>
      </section>

      <section
        id="products"
        className="relative py-24 md:py-32 px-6 lg:px-10 bg-[#080808]"
        data-testid="featured-section"
      >
        <div className="max-w-[1400px] mx-auto">
          <SectionHeading
            eyebrow="Featured Pieces"
            title="The current edit"
            subtitle="Hand-picked from this season's atelier — pieces that travel beautifully, gift effortlessly."
          />
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-[#141414] animate-pulse" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#D4AF37]/20">
              <p className="text-neutral-400 text-sm uppercase tracking-[0.3em]">
                No featured pieces yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
