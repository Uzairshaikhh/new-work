import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resolveMedia } from "../lib/api";

const KEY = "ag_recently_viewed";
const MAX = 8;

export const pushRecentlyViewed = (product) => {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    const filtered = list.filter((p) => p.id !== product.id);
    const next = [{ id: product.id, name: product.name, image_url: product.image_url }, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
};

export const getRecentlyViewed = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};

const RecentlyViewed = ({ excludeId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const list = getRecentlyViewed().filter((p) => p.id !== excludeId);
    setItems(list.slice(0, 6));
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <section className="py-12 px-6 lg:px-10 border-t border-[#d4af37]/10">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-4">Your History</div>
        <h3 className="font-display text-xl text-white mb-5">Recently Viewed</h3>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {items.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="flex-shrink-0 w-28 group"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-[#15151a] mb-2 border border-[#d4af37]/10 group-hover:border-amber-brand/40 transition-colors">
                <img
                  src={resolveMedia(p.image_url, 200)}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="text-xs text-gray-400 group-hover:text-white transition-colors line-clamp-2 leading-tight">{p.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
