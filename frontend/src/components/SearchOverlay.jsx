import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, X, Clock, Trash2 } from "lucide-react";
import { api, resolveMedia } from "../lib/api";

const HISTORY_KEY = "ag_search_history";
const MAX_HISTORY = 6;

const readHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
};
const writeHistory = (terms) => localStorage.setItem(HISTORY_KEY, JSON.stringify(terms.slice(0, MAX_HISTORY)));

const SearchOverlay = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) { setQuery(""); return; }
    setHistory(readHistory());
    setLoading(true);
    Promise.all([api.get("/products"), api.get("/categories")])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data); })
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) return;
    const t = setTimeout(() => {
      const current = readHistory();
      const next = [q, ...current.filter((x) => x.toLowerCase() !== q.toLowerCase())];
      writeHistory(next);
      setHistory(next.slice(0, MAX_HISTORY));
    }, 900);
    return () => clearTimeout(t);
  }, [query, open]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)).slice(0, 8);
  }, [products, query]);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4);
  }, [categories, query]);

  const clearHistory = () => { localStorage.removeItem(HISTORY_KEY); setHistory([]); };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl animate-fade-in" data-testid="search-overlay">
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold">Search the catalogue</div>
          <button onClick={onClose} className="text-navy hover:text-amber-brand transition-colors" data-testid="search-close-btn" aria-label="Close search">
            <X size={22} />
          </button>
        </div>

        <div className="flex items-center gap-4 border-b-2 border-amber-brand/30 pb-3">
          <SearchIcon size={22} className="text-amber-brand" />
          <input type="text" autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories..."
            className="flex-1 bg-transparent outline-none font-display text-xl md:text-3xl text-navy placeholder:text-gray-400"
            data-testid="search-input" />
        </div>

        <div className="mt-8 space-y-8">
          {!query.trim() && history.length > 0 && (
            <div data-testid="search-history">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs uppercase tracking-[0.25em] text-gray-500 font-semibold">Recent searches</div>
                <button onClick={clearHistory} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-amber-brand transition-colors" data-testid="search-history-clear">
                  <Trash2 size={12} /> Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((h) => (
                  <button key={h} onClick={() => setQuery(h)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:border-amber-brand hover:bg-amber-cream text-sm text-navy transition-all"
                    data-testid={`search-history-item-${h}`}>
                    <Clock size={12} className="text-amber-brand" /> {h}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query.trim() && history.length === 0 && !loading && (
            <p className="text-sm text-gray-500 text-center" data-testid="search-empty-hint">Start typing to find products and categories.</p>
          )}

          {query.trim() && filteredCategories.length === 0 && filteredProducts.length === 0 && !loading && (
            <p className="text-sm text-gray-500 text-center" data-testid="search-no-results">No results for "{query}". Try another term.</p>
          )}

          {filteredCategories.length > 0 && (
            <div data-testid="search-categories-section">
              <div className="text-xs uppercase tracking-[0.25em] text-gray-500 font-semibold mb-3">Categories</div>
              <div className="space-y-1">
                {filteredCategories.map((c) => (
                  <Link key={c.id} to={`/category/${c.id}`} onClick={onClose} className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream border border-transparent hover:border-amber-soft transition-all" data-testid={`search-cat-${c.id}`}>
                    <img src={resolveMedia(c.image_url)} alt="" className="w-12 h-12 object-cover rounded-lg" />
                    <div className="font-display text-lg text-navy">{c.name}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div data-testid="search-products-section">
              <div className="text-xs uppercase tracking-[0.25em] text-gray-500 font-semibold mb-3">Products</div>
              <div className="space-y-1">
                {filteredProducts.map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} onClick={onClose} className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream border border-transparent hover:border-amber-soft transition-all" data-testid={`search-product-${p.id}`}>
                    <img src={resolveMedia(p.image_url)} alt="" className="w-12 h-12 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-base text-navy truncate">{p.name}</div>
                      {p.description && <div className="text-xs text-gray-500 truncate">{p.description}</div>}
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
