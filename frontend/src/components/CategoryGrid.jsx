import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { resolveMedia } from "../lib/api";

const CategoryGrid = ({ categories = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4" data-testid="categories-skeleton">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-[#15151a] rounded-xl aspect-[4/5] animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-[#d4af37]/20 rounded-xl" data-testid="categories-empty">
        <p className="text-gray-500 text-xs uppercase tracking-[0.25em]">No categories yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4" data-testid="categories-grid">
      {categories.map((c, idx) => (
        <Link
          key={c.id}
          to={`/category/${c.id}`}
          className="group relative flex flex-col overflow-hidden rounded-xl border border-[#d4af37]/12 bg-[#15151a]/80
            hover:border-[#d4af37]/40 transition-all duration-400
            hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6),0_0_20px_rgba(212,175,55,0.08)]"
          style={{ transitionDelay: `${idx * 30}ms` }}
          data-testid={`category-card-${c.id}`}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-[#0e0e13]">
            <img
              src={resolveMedia(c.image_url, 400)}
              alt={c.name}
              loading="lazy"
              decoding="async"
              width={400}
              height={300}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d]/80 via-[#0a0a0d]/15 to-transparent" />
            {/* Top gold shimmer line on hover */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/0 to-transparent group-hover:via-[#d4af37]/50 transition-all duration-500" />
          </div>

          {/* Text */}
          <div className="px-3 py-3 flex flex-col flex-1 relative">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/0 to-[#d4af37]/0 group-hover:from-[#d4af37]/[0.03] transition-all duration-400 pointer-events-none rounded-b-xl" />

            <h3 className="font-display text-sm text-white/90 group-hover:text-white transition-colors duration-200 leading-snug text-center mb-2">
              {c.name}
            </h3>
            <div className="flex items-center justify-center gap-1 text-[10px] font-semibold text-[#d4af37]/70 group-hover:text-[#d4af37] transition-all duration-300 group-hover:gap-2">
              View Products <ArrowRight size={10} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
