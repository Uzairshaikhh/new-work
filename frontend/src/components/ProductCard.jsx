import { Link } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";
import { resolveMedia } from "../lib/api";

const WHATSAPP = "918657211339";
const PHONE = "+918657211339";

const ProductCard = ({ product }) => {
  const waText = encodeURIComponent(
    `Hi Amazing Groups, I'm interested in "${product.name}". Could you share more details?`
  );

  return (
    <div
      className="group relative bg-[#0e0e0e] border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 transition-all duration-500 hover:gold-glow flex flex-col"
      data-testid={`product-card-${product.id}`}
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
        <img
          src={resolveMedia(product.image_url)}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-2xl text-white leading-tight hover:text-[#D4AF37] transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.price && (
          <div className="eyebrow mt-2 text-neutral-500">{product.price}</div>
        )}
        {product.description && (
          <p className="text-sm text-neutral-400 font-light mt-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="mt-6 pt-5 border-t border-[#D4AF37]/10 flex gap-2">
          <a
            href={`https://wa.me/${WHATSAPP}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-gold flex-1 !px-3 !py-3 !text-[10px]"
            data-testid={`product-whatsapp-${product.id}`}
          >
            <MessageCircle size={14} strokeWidth={1.5} />
            WhatsApp
          </a>
          <a
            href={`tel:${PHONE}`}
            className="btn-gold flex-1 !px-3 !py-3 !text-[10px]"
            data-testid={`product-call-${product.id}`}
          >
            <Phone size={14} strokeWidth={1.8} />
            Call
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
