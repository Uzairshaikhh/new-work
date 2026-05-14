import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { api, resolveMedia } from "../lib/api";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: category?.name || "Collection",
    description: category?.description || "Premium corporate gifts from Amazing Groups Mumbai.",
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    Promise.all([api.get(`/categories/${id}`), api.get(`/categories/${id}/products`)])
      .then(([c, p]) => {
        if (!mounted) return;
        setCategory(c.data);
        setProducts(p.data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  return (
    <div className="min-h-screen bg-white" data-testid="category-page">
      <Navbar />

      <section className="hero-gradient py-16 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-amber-brand mb-8 transition-colors"
            data-testid="back-to-home"
          >
            <ChevronLeft size={16} /> Back to Home
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-4">Collection</div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-navy leading-[1.05] mb-4">
                {category?.name || "Loading..."}
              </h1>
              {category?.description && (
                <p className="text-gray-700 mt-5 max-w-lg text-base md:text-lg">{category.description}</p>
              )}
            </div>
            {category?.image_url && (
              <div className="relative aspect-[5/4] rounded-2xl overflow-hidden shadow-xl">
                <img src={resolveMedia(category.image_url)} alt={category.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 lg:px-10" data-testid="category-products">
        <div className="max-w-[1400px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
              <p className="text-gray-500 text-sm uppercase tracking-wider">Pieces coming soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryPage;
