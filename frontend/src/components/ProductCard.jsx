import { Link } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";
import { resolveMedia } from "../lib/api";
import { BRAND, waLink } from "../lib/brand";

const ProductCard = ({ product }) => {
  const waHref = waLink(
    `Hi Amazing Groups, I'm interested in "${product.name}". Could you share more details and bulk pricing?`
  );

  return (
    <div
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden card-shadow card-shadow-hover flex flex-col"
      data-testid={`product-card-${product.id}`}
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-amber-cream">
        <img
          src={resolveMedia(product.image_url)}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-amber-brand text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            Popular
          </span>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-lg text-navy hover:text-amber-brand transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>
        {product.price && (
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xs text-gray-500">From</span>
            <span className="text-base font-bold text-amber-brand">{product.price}</span>
          </div>
        )}
        {product.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            data-testid={`product-whatsapp-${product.id}`}
          >
            <MessageCircle size={13} /> WhatsApp
          </a>
          <a
            href={`tel:${BRAND.phoneTel}`}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg bg-navy text-white hover:bg-navy-900 transition-colors"
            data-testid={`product-call-${product.id}`}
          >
            <Phone size={13} /> Call
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
