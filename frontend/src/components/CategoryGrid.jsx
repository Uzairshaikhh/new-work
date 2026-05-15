import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { resolveMedia } from "../lib/api";

const CategoryGrid = ({ categories = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5" data-testid="categories-skeleton">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-[#1a1a22] rounded-2xl aspect-[4/5] animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-[#d4af37]/20 rounded-2xl" data-testid="categories-empty">
        <p className="text-gray-500 text-sm uppercase tracking-wider">No collections yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5" data-testid="categories-grid">
      {categories.map((c) => (
        <Link
          key={c.id}
          to={`/category/${c.id}`}
          className="group bg-[#15151a] border border-[#d4af37]/15 rounded-2xl p-4 card-shadow card-shadow-hover flex flex-col"
          data-testid={`category-card-${c.id}`}
        >
          <div className="relative aspect-square rounded-xl overflow-hidden bg-[#15151a] mb-4">
            <img
              src={resolveMedia(c.image_url)}
              alt={c.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <h3 className="font-display text-lg text-white mb-2">{c.name}</h3>
          <div className="mt-auto pt-3 flex items-center gap-2 text-sm font-semibold text-amber-brand group-hover:gap-3 transition-all">
            View Products <ArrowRight size={14} />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
