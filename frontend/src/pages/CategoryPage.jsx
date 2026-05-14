import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { api, resolveMedia } from "../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      api.get(`/categories/${id}`),
      api.get(`/categories/${id}/products`),
    ])
      .then(([c, p]) => {
        if (!mounted) return;
        setCategory(c.data);
        setProducts(p.data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]" data-testid="category-page">
      <Navbar />

      <section className="relative h-[60vh] min-h-[420px] w-full">
        {category && (
          <>
            <img
              src={resolveMedia(category.image_url)}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/40" />
          </>
        )}
        <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-end pb-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-neutral-300 hover:text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] mb-6 transition-colors"
            data-testid="back-to-home"
          >
            <ChevronLeft size={14} /> Back
          </Link>
          <div className="eyebrow mb-4">Collection</div>
          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.05] max-w-3xl">
            {category?.name || "Loading..."}
          </h1>
          {category?.description && (
            <p className="text-neutral-300 font-light mt-6 max-w-xl text-base md:text-lg">
              {category.description}
            </p>
          )}
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 lg:px-10" data-testid="category-products">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-[#141414] animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#D4AF37]/20">
              <p className="text-neutral-400 text-sm uppercase tracking-[0.3em]">
                Pieces coming soon
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryPage;
