import { Link } from "react-router-dom";
import { resolveMedia } from "../lib/api";
import { waLink } from "../lib/brand";

const ProductCard = ({ product, compact = false }) => {
  const waHref = waLink(
    `Hi Amazing Groups, I'm interested in "${product.name}". Could you share more details and bulk pricing?`
  );

  return (
    <div
      className={`group bg-[#15151a] border border-[#d4af37]/15 rounded-lg overflow-hidden hover:border-[#d4af37]/45 transition-all flex flex-col ${compact ? "text-[9px]" : ""}`}
      data-testid={`product-card-${product.id}`}
    >
      <Link
        to={`/product/${product.id}`}
        className={`block relative ${compact ? "aspect-[4/3]" : "aspect-square"} overflow-hidden bg-[#0e0e13]`}
      >
        <img
  src={resolveMedia(product.image_url)}
  alt={product.name}
  loading="lazy"
  decoding="async"
  width="400"
  height="400"
  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
/>
        {product.badge && product.badge !== "" ? (
          <span className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
            product.badge === "bestseller" ? "bg-amber-brand text-[#0a0a0d]" :
            product.badge === "new" ? "bg-emerald-500 text-white" :
            product.badge === "trending" ? "bg-orange-500 text-white" :
            product.badge === "premium" ? "bg-purple-500 text-white" : ""
          }`}>
            {product.badge === "bestseller" ? "Bestseller" :
             product.badge === "new" ? "New" :
             product.badge === "trending" ? "Trending" :
             product.badge === "premium" ? "Premium" : ""}
          </span>
        ) : product.featured ? (
          <span className="absolute top-2 left-2 bg-amber-brand text-[#0a0a0d] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Popular
          </span>
        ) : null}
      </Link>

      <div className={`${compact ? "p-2" : "p-3"} flex flex-col flex-1`}>
        <Link to={`/product/${product.id}`}>
          <h3 className={`font-display ${compact ? "text-xs" : "text-sm"} text-white hover:text-amber-brand transition-colors leading-tight line-clamp-1`}>
            {product.name}
          </h3>
        </Link>
        {product.price && (
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-[10px] text-gray-400">From</span>
            <span className="text-xs font-bold text-amber-brand">{product.price}</span>
          </div>
        )}

        <div className="mt-2.5 pt-2.5 border-t border-[#d4af37]/10 grid grid-cols-2 gap-1.5">
          <Link
            to={`/product/${product.id}`}
            className={`inline-flex items-center justify-center ${compact ? "py-1" : "py-1.5"} text-[10px] font-semibold rounded border border-[#d4af37]/30 text-amber-brand hover:bg-[#d4af37]/10 transition-colors`}
            data-testid={`product-view-${product.id}`}
          >
            View Details
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center ${compact ? "py-1" : "py-1.5"} text-[10px] font-semibold rounded bg-amber-brand text-[#0a0a0d] hover:bg-[#e8c850] transition-colors`}
            data-testid={`product-whatsapp-${product.id}`}
          >
            Add to Inquiry
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
