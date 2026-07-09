import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MessageCircle, Phone, Building2 } from "lucide-react";
import { api } from "../lib/api";
import { resolveMedia } from "../lib/api";
import { waLink, BRAND } from "../lib/brand";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const CorporateCategoryPage = () => {
  const { slug } = useParams();
  const [cat, setCat] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: cat?.seo_title || (cat ? `${cat.name} — Amazing Groups` : "Corporate Gifting — Amazing Groups"),
    description: cat?.seo_description || cat?.description || "Premium corporate gifting solutions from Amazing Groups.",
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get(`/corporate-categories/${slug}`)
      .then(async (r) => {
        if (!mounted) return;
        setCat(r.data);
        if (r.data.product_ids?.length > 0) {
          const allRes = await api.get("/products?limit=1000").catch(() => ({ data: [] }));
          const filtered = allRes.data.filter((p) => r.data.product_ids.includes(p.id));
          if (mounted) setProducts(filtered);
        }
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [slug]);

  const waHref = waLink(`Hi Amazing Groups, I'm interested in ${cat?.name || "your corporate gifting solutions"}. Could you share details?`);

  return (
    <div className="min-h-screen bg-[#0a0a0d]">
      <Navbar />

      {/* Banner / Header */}
      {loading ? (
        <div className="h-48 bg-[#15151a] animate-pulse" />
      ) : cat ? (
        <section className="relative overflow-hidden border-b border-[#d4af37]/15">
          {cat.banner_image ? (
            <>
              <img src={resolveMedia(cat.banner_image, 1400)} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0d] via-[#0a0a0d]/80 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 hero-gradient" />
          )}
          <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 py-14 md:py-20">
            <Link to="/corporate" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-amber-brand mb-5 transition-colors">
              <ChevronLeft size={14} /> Corporate Gifting
            </Link>
            <div className="flex items-center gap-3 mb-4">
              {cat.icon && <span className="text-3xl">{cat.icon}</span>}
              {cat.featured && <span className="text-[9px] bg-amber-brand text-[#0a0a0d] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Featured</span>}
              {cat.trending && <span className="text-[9px] bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Trending</span>}
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-white mb-3 max-w-2xl leading-tight">{cat.name}</h1>
            {(cat.long_description || cat.description) && (
              <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mb-6">{cat.long_description || cat.description}</p>
            )}
            <div className="flex flex-wrap gap-3">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-amber !py-2.5 !px-6 !text-sm">
                <MessageCircle size={15} /> Get a Quote
              </a>
              <a href={`tel:${BRAND.phoneTel}`} className="btn-primary !py-2.5 !px-6 !text-sm">
                <Phone size={15} /> Call Us
              </a>
            </div>
          </div>
        </section>
      ) : (
        <section className="hero-gradient border-b border-[#d4af37]/15 py-14 px-6 lg:px-10">
          <div className="max-w-[1280px] mx-auto">
            <Link to="/corporate" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-amber-brand mb-5 transition-colors">
              <ChevronLeft size={14} /> Corporate Gifting
            </Link>
            <h1 className="font-display text-3xl text-white">Category Not Found</h1>
          </div>
        </section>
      )}

      {/* Products */}
      <section className="py-10 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-[#15151a] rounded-lg animate-pulse" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#d4af37]/20 rounded-xl">
              <Building2 size={32} className="text-amber-brand/30 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No products assigned to this category yet.</p>
              <Link to="/products" className="mt-4 inline-block text-xs text-amber-brand hover:underline">
                Browse all products →
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[11px] text-gray-600 mb-5 uppercase tracking-wider">{products.length} product{products.length !== 1 ? "s" : ""}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CorporateCategoryPage;
