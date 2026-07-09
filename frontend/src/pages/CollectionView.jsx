import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const CollectionView = () => {
  const { id } = useParams();
  const [col, setCol] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: col ? `${col.title} — Amazing Groups` : "Collection — Amazing Groups",
    description: col?.description || "Browse this curated corporate gifting collection from Amazing Groups.",
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get("/collections").then(async (r) => {
      if (!mounted) return;
      const found = r.data.find((c) => c.id === id);
      if (!found) { setLoading(false); return; }
      setCol(found);
      if (found.product_ids?.length > 0) {
        const all = await api.get("/products?limit=1000").catch(() => ({ data: [] }));
        const filtered = all.data.filter((p) => found.product_ids.includes(p.id));
        if (mounted) setProducts(filtered);
      }
    }).catch(() => {}).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0a0a0d]">
      <Navbar />

      <section className="hero-gradient border-b border-[#d4af37]/15 py-10 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <Link to="/collections" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-amber-brand mb-5 transition-colors">
            <ChevronLeft size={15} /> All Collections
          </Link>
          {loading ? (
            <div className="h-10 w-64 bg-[#15151a] animate-pulse rounded" />
          ) : col ? (
            <>
              {col.badge && (
                <span className="inline-block bg-amber-brand text-[#0a0a0d] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3">
                  {col.badge}
                </span>
              )}
              <h1 className="font-display text-3xl md:text-4xl text-white mb-2">{col.title}</h1>
              {col.description && <p className="text-gray-400 text-sm max-w-xl">{col.description}</p>}
            </>
          ) : (
            <h1 className="font-display text-3xl text-white">Collection Not Found</h1>
          )}
        </div>
      </section>

      <section className="py-8 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-[#15151a] animate-pulse rounded-lg" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#d4af37]/20 rounded-lg">
              <Sparkles size={28} className="text-amber-brand/40 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No products in this collection yet.</p>
              <Link to="/products" className="mt-4 inline-block text-xs text-amber-brand hover:underline">Browse all products →</Link>
            </div>
          ) : (
            <>
              <p className="text-[11px] text-gray-600 mb-4 uppercase tracking-wider">{products.length} product{products.length !== 1 ? "s" : ""}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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

export default CollectionView;
