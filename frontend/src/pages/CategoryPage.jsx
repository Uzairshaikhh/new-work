import { useEffect, useState, useMemo } from "react";
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
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubcat, setActiveSubcat] = useState("");

  useSEO({
    title: category?.name || "Collection",
    description:
      category?.description ||
      "Premium corporate gifts from Amazing Groups Mumbai.",
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setActiveSubcat("");
    window.scrollTo({ top: 0, behavior: "instant" });

    Promise.all([
      api.get(`/categories/${id}`),
      api.get(`/categories/${id}/products`),
      api.get(`/subcategories/category/${id}`),
    ])
      .then(([c, p, s]) => {
        if (!mounted) return;
        setCategory(c.data);
        setProducts(p.data);
        setSubcategories(s.data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  // Client-side filter — instant, no API call
  const filtered = useMemo(() => {
    if (!activeSubcat) return products;
    return products.filter((p) => p.subcategory_id === activeSubcat);
  }, [products, activeSubcat]);

  return (
    <div className="min-h-screen bg-[#0a0a0d]" data-testid="category-page">
      <Navbar />

      {/* Category header */}
      <section className="hero-gradient border-b border-[#d4af37]/15 py-10 md:py-14 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-amber-brand mb-6 transition-colors"
            data-testid="back-to-home"
          >
            <ChevronLeft size={15} /> Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">
                Collection
              </div>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-10 w-64 bg-[#15151a] rounded-lg animate-pulse" />
                  <div className="h-4 w-80 bg-[#15151a] rounded animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-3">
                    {category?.name}
                  </h1>
                  {category?.description && (
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-lg">
                      {category.description}
                    </p>
                  )}
                </>
              )}
            </div>

            {category?.image_url && (
              <div className="relative aspect-[5/3] rounded-xl overflow-hidden shadow-2xl border border-[#d4af37]/20">
                <img
                  src={resolveMedia(category.image_url, 800)}
                  alt={category.name}
                  width={800}
                  height={480}
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subcategory filter pills — only shown when subcategories exist */}
      {!loading && subcategories.length > 0 && (
        <section className="border-b border-[#d4af37]/10 bg-[#0a0a0d] px-6 lg:px-10 py-3">
          <div
            className="max-w-[1280px] mx-auto flex items-center gap-2.5 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
            data-testid="subcategory-filters"
          >
            {/* All pill */}
            <button
              onClick={() => setActiveSubcat("")}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                !activeSubcat
                  ? "bg-amber-brand text-[#0a0a0d] border-amber-brand"
                  : "bg-transparent text-white/70 border-[#d4af37]/25 hover:border-amber-brand hover:text-white"
              }`}
            >
              All
            </button>

            {subcategories.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSubcat(s.id)}
                data-testid={`subcat-filter-${s.id}`}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  activeSubcat === s.id
                    ? "bg-amber-brand text-[#0a0a0d] border-amber-brand"
                    : "bg-transparent text-white/70 border-[#d4af37]/25 hover:border-amber-brand hover:text-white"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Products grid */}
      <section className="py-8 px-6 lg:px-10" data-testid="category-products">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-[#15151a] rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#d4af37]/20 rounded-lg">
              <p className="text-gray-400 text-xs uppercase tracking-wider">
                No products in this collection yet
              </p>
              {activeSubcat && (
                <button
                  onClick={() => setActiveSubcat("")}
                  className="mt-4 text-xs text-amber-brand hover:underline"
                >
                  Show all products
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-[11px] text-gray-600 mb-4 uppercase tracking-wider">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CategoryPage;
