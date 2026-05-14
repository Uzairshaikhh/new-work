import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { resolveMedia } from "../lib/api";

const CategoryGrid = ({ categories = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="categories-skeleton">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] bg-[#141414] animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-[#D4AF37]/20" data-testid="categories-empty">
        <p className="text-neutral-400 text-sm uppercase tracking-[0.3em]">No collections yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="categories-grid">
      {categories.map((c) => (
        <Link
          key={c.id}
          to={`/category/${c.id}`}
          className="group relative aspect-[4/5] overflow-hidden border border-[#D4AF37]/15 hover:border-[#D4AF37]/50 transition-all duration-500"
          data-testid={`category-card-${c.id}`}
        >
          <img
            src={resolveMedia(c.image_url)}
            alt={c.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="eyebrow mb-3 opacity-80">Collection</div>
                <h3 className="font-display text-3xl md:text-4xl text-white leading-tight">
                  {c.name}
                </h3>
                {c.description && (
                  <p className="text-sm text-neutral-400 mt-3 font-light max-w-xs">{c.description}</p>
                )}
              </div>
              <ArrowUpRight
                size={28}
                strokeWidth={1.2}
                className="text-[#D4AF37] flex-shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
