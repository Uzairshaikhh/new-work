import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { resolveMedia } from "../lib/api";

const CategoryGrid = ({ categories = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" data-testid="categories-skeleton">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-[#15151a] rounded-lg aspect-[4/5] animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-[#d4af37]/20 rounded-lg" data-testid="categories-empty">
        <p className="text-gray-400 text-xs uppercase tracking-wider">No collections yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" data-testid="categories-grid">
      {categories.map((c) => (
        <Link
          key={c.id}
          to={`/category/${c.id}`}
          className="group bg-[#15151a] border border-[#d4af37]/15 rounded-lg p-4 hover:border-[#d4af37]/50 transition-all flex flex-col"
          data-testid={`category-card-${c.id}`}
        >
          <div className="relative aspect-square rounded-md overflow-hidden bg-[#0e0e13] mb-3">
            <img
              src={resolveMedia(c.image_url, 400)}
              alt={c.name}
              loading="lazy"
              decoding="async"
              width={400}
              height={400}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <h3 className="font-display text-sm md:text-base text-white text-center mb-1.5 leading-tight">{c.name}</h3>
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-amber-brand group-hover:gap-2 transition-all">
            View Products <ArrowRight size={11} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
