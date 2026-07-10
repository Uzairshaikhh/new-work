import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Eye } from "lucide-react";
import { resolveMedia } from "../lib/api";
import { waLink } from "../lib/brand";

const BADGE_STYLES = {
  bestseller: "bg-[#d4af37] text-[#0a0a0d]",
  new:        "bg-emerald-500 text-white",
  trending:   "bg-orange-500 text-white",
  premium:    "bg-purple-600 text-white",
};
const BADGE_LABELS = {
  bestseller: "Bestseller",
  new:        "New",
  trending:   "Trending",
  premium:    "Premium",
};

const ProductCard = ({ product, compact = false }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  const waHref = waLink(
    `Hi Amazing Groups, I'm interested in "${product.name}". Could you share more details and bulk pricing?`
  );

  const badge = product.badge && product.badge !== "" ? product.badge : product.featured ? "popular" : null;
  const badgeStyle = badge === "popular" ? "bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30" : BADGE_STYLES[badge] || "";
  const badgeLabel = badge === "popular" ? "Popular" : BADGE_LABELS[badge] || "";

  return (
    <div
      className={`group relative flex flex-col bg-[#15151a]/80 border border-[#d4af37]/12 rounded-xl overflow-hidden
        transition-all duration-400 ease-out
        hover:border-[#d4af37]/35 hover:-translate-y-1.5
        hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.65),0_0_25px_rgba(212,175,55,0.1)]
        ${compact ? "text-[9px]" : ""}`}
      style={{ backdropFilter: "blur(8px)" }}
      data-testid={`product-card-${product.id}`}
    >
      {/* Inner top glow on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/0 to-transparent
          group-hover:via-[#d4af37]/40 transition-all duration-500 pointer-events-none z-10"
      />

      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className={`block relative ${compact ? "aspect-[4/3]" : "aspect-square"} overflow-hidden bg-[#0e0e13]`}
        tabIndex={-1}
      >
        {/* Shimmer while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#15151a] via-[#1e1e26] to-[#15151a] animate-shimmer" />
        )}

        <img
          src={resolveMedia(product.image_url)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width="400"
          height="400"
          onLoad={() => setImgLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.06] ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        {/* Quick view overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="glass-dark border border-[#d4af37]/25 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-white shadow-lg">
            <Eye size={11} className="text-amber-brand" /> Quick View
          </div>
        </div>

        {/* Badge */}
        {badge && badgeLabel && (
          <span
            className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm ${badgeStyle}`}
          >
            {badgeLabel}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className={`${compact ? "p-2.5" : "p-3.5"} flex flex-col flex-1`}>
        <Link to={`/product/${product.id}`}>
          <h3
            className={`font-display ${compact ? "text-xs" : "text-sm"} text-white/90 hover:text-amber-brand transition-colors duration-200 leading-snug line-clamp-1 mb-1`}
          >
            {product.name}
          </h3>
        </Link>

        {product.price && (
          <div className="flex items-baseline gap-1 mb-2.5">
            <span className="text-[9px] text-gray-500 uppercase tracking-wider">From</span>
            <span className="text-xs font-bold text-[#d4af37]">{product.price}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-auto pt-2.5 border-t border-[#d4af37]/8 grid grid-cols-2 gap-1.5">
          <Link
            to={`/product/${product.id}`}
            className={`inline-flex items-center justify-center ${compact ? "py-1.5" : "py-2"} text-[10px] font-semibold rounded-lg border border-[#d4af37]/25 text-[#d4af37] hover:border-[#d4af37]/60 hover:bg-[#d4af37]/8 transition-all duration-200`}
            data-testid={`product-view-${product.id}`}
          >
            View Details
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-1 ${compact ? "py-1.5" : "py-2"} text-[10px] font-semibold rounded-lg bg-[#d4af37] text-[#0a0a0d] hover:bg-[#e8c850] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(212,175,55,0.4)]`}
            data-testid={`product-whatsapp-${product.id}`}
          >
            <MessageCircle size={10} /> Inquire
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
