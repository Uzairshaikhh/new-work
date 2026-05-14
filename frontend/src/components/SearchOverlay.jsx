import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { api, resolveMedia } from "../lib/api";

const SearchOverlay = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    setLoading(true);
    Promise.all([api.get("/products"), api.get("/categories")])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(c.data);
      })
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [products, query]);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return categories
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 4);
  }, [categories, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a]/95 backdrop-blur-xl animate-fade-in" data-testid="search-overlay">
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-12">
        <div className="flex items-center justify-between mb-10">
          <div className="eyebrow">Search the atelier</div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-[#D4AF37] transition-colors"
            data-testid="search-close-btn"
            aria-label="Close search"
          >
            <X size={22} strokeWidth={1.4} />
          </button>
        </div>

        <div className="flex items-center gap-4 border-b border-[#D4AF37]/30 pb-4">
          <SearchIcon size={22} strokeWidth={1.3} className="text-[#D4AF37]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, collections..."
            className="flex-1 bg-transparent outline-none font-display text-2xl md:text-4xl text-white placeholder:text-neutral-600"
            data-testid="search-input"
          />
        </div>

        <div className="mt-10 space-y-10">
          {!query.trim() && !loading && (
            <p className="text-sm text-neutral-500 font-light text-center" data-testid="search-empty-hint">
              Start typing to find pieces and collections.
            </p>
          )}

          {query.trim() && filteredCategories.length === 0 && filteredProducts.length === 0 && !loading && (
            <p className="text-sm text-neutral-500 font-light text-center" data-testid="search-no-results">
              No results for "{query}". Try another term.
            </p>
          )}

          {filteredCategories.length > 0 && (
            <div data-testid="search-categories-section">
              <div className="eyebrow mb-4">Collections</div>
              <div className="space-y-2">
                {filteredCategories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 hover:bg-[#D4AF37]/5 border border-transparent hover:border-[#D4AF37]/20 transition-all"
                    data-testid={`search-cat-${c.id}`}
                  >
                    <img src={resolveMedia(c.image_url)} alt="" className="w-14 h-14 object-cover border border-[#D4AF37]/20" />
                    <div className="font-display text-xl text-white">{c.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div data-testid="search-products-section">
              <div className="eyebrow mb-4">Pieces</div>
              <div className="space-y-2">
                {filteredProducts.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 hover:bg-[#D4AF37]/5 border border-transparent hover:border-[#D4AF37]/20 transition-all"
                    data-testid={`search-product-${p.id}`}
                  >
                    <img src={resolveMedia(p.image_url)} alt="" className="w-14 h-14 object-cover border border-[#D4AF37]/20" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-lg text-white truncate">{p.name}</div>
                      {p.description && (
                        <div className="text-xs text-neutral-500 truncate font-light">{p.description}</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
