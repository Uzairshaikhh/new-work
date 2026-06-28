import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, Search, X } from "lucide-react";
import { api } from "../lib/api";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCat = searchParams.get("category") || "";

  useSEO({
    title: "All Products",
    description:
      "Browse all premium corporate gifts from Amazing Groups — custom wallets, bottles, diaries & more. Bulk orders, pan-India delivery.",
  });

  useEffect(() => {
    let mounted = true;
    Promise.all([api.get("/products?limit=500"), api.get("/categories")])
      .then(([p, c]) => {
        if (!mounted) return;
        setProducts(p.data);
        setCategories(c.data);
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCat) list = list.filter((p) => p.category_id === activeCat);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, activeCat, query]);

  const setCategory = (id) => {
    if (id) setSearchParams({ category: id });
    else setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#0a0a0d]" data-testid="all-products-page">
      <Navbar />

      {/* Page header */}
      <section className="hero-gradient border-b border-[#d4af37]/15 py-10 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-amber-brand mb-5 transition-colors"
          >
            <ChevronLeft size={15} /> Back to Home
          </Link>
          <h1 className="font-display text-3xl md:text-4xl text-white leading-tight">
            All Products
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Premium corporate gifts — custom branded for your business.
          </p>
        </div>
      </section>

      {/* Filters bar */}
      <section className="border-b border-[#d4af37]/10 bg-[#0a0a0d] px-6 lg:px-10 py-3">
        <div className="max-w-[1280px] mx-auto flex items-center gap-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {/* Search */}
          <div className="relative flex-shrink-0">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-[#15151a] border border-[#d4af37]/20 rounded-full pl-8 pr-8 py-1.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-brand w-40 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-[#d4af37]/15 flex-shrink-0" />

          {/* All pill */}
          <button
            onClick={() => setCategory("")}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              !activeCat
                ? "bg-amber-brand text-[#0a0a0d] border-amber-brand"
                : "bg-transparent text-white/70 border-[#d4af37]/25 hover:border-amber-brand hover:text-white"
            }`}
          >
            All
          </button>

          {/* Category pills */}
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeCat === c.id
                  ? "bg-amber-brand text-[#0a0a0d] border-amber-brand"
                  : "bg-transparent text-white/70 border-[#d4af37]/25 hover:border-amber-brand hover:text-white"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products grid */}
      <section className="py-8 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#15151a] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#d4af37]/20 rounded-lg">
              <p className="text-gray-400 text-xs uppercase tracking-wider">No products found</p>
              {(query || activeCat) && (
                <button
                  onClick={() => { setQuery(""); setCategory(""); }}
                  className="mt-4 text-xs text-amber-brand hover:underline"
                >
                  Clear filters
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

export default AllProducts;
