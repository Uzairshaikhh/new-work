import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MessageCircle, Phone, Play } from "lucide-react";
import { api, resolveMedia } from "../lib/api";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const WHATSAPP = "918657211339";
const PHONE = "+918657211339";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useSEO({
    title: product?.name || "Product",
    description: product?.description?.slice(0, 160) || "Handcrafted luxury gift from Amazing Groups Mumbai.",
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((r) => mounted && setProduct(r.data))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="pt-32 px-6 lg:px-10 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-[4/5] bg-[#141414] animate-pulse" />
            <div className="space-y-6">
              <div className="h-12 bg-[#141414] animate-pulse w-3/4" />
              <div className="h-4 bg-[#141414] animate-pulse w-1/2" />
              <div className="h-32 bg-[#141414] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <div className="pt-40 text-center">
          <p className="text-neutral-400 uppercase tracking-[0.3em] text-sm">Product not found</p>
          <Link to="/" className="btn-ghost-gold mt-8 inline-flex">Return Home</Link>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];
  const waText = encodeURIComponent(
    `Hi Amazing Groups, I'm interested in "${product.name}". Could you share more details?`
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]" data-testid="product-detail-page">
      <Navbar />

      <div className="pt-32 pb-24 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-neutral-300 hover:text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] mb-10 transition-colors"
            data-testid="back-link"
          >
            <ChevronLeft size={14} /> Back
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Gallery */}
            <div data-testid="product-gallery">
              <div className="relative aspect-[4/5] overflow-hidden border border-[#D4AF37]/15">
                {showVideo && product.video_url ? (
                  <video
                    src={resolveMedia(product.video_url)}
                    controls
                    autoPlay
                    className="absolute inset-0 w-full h-full object-cover"
                    data-testid="product-video"
                  />
                ) : (
                  <img
                    src={resolveMedia(images[activeImage])}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="mt-4 flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveImage(i);
                      setShowVideo(false);
                    }}
                    className={`w-20 h-20 overflow-hidden border transition-all ${
                      activeImage === i && !showVideo
                        ? "border-[#D4AF37]"
                        : "border-[#D4AF37]/15 hover:border-[#D4AF37]/40"
                    }`}
                    data-testid={`thumb-${i}`}
                  >
                    <img src={resolveMedia(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                {product.video_url && (
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`w-20 h-20 flex items-center justify-center border transition-all ${
                      showVideo
                        ? "border-[#D4AF37] text-[#D4AF37]"
                        : "border-[#D4AF37]/15 text-neutral-400 hover:border-[#D4AF37]/40"
                    }`}
                    data-testid="thumb-video"
                  >
                    <Play size={20} strokeWidth={1.5} />
                  </button>
                )}
              </div>
            </div>

            {/* Info */}
            <div data-testid="product-info">
              <div className="eyebrow mb-5">Amazing Groups</div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-[1.05] mb-6">
                {product.name}
              </h1>
              <div className="divider-gold mb-8" />
              {product.price && (
                <div className="text-2xl font-display gold-text mb-6">{product.price}</div>
              )}
              <p className="text-neutral-300 font-light text-base md:text-lg leading-relaxed mb-10 whitespace-pre-line">
                {product.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold flex-1"
                  data-testid="detail-whatsapp-btn"
                >
                  <MessageCircle size={16} strokeWidth={1.8} />
                  Enquire via WhatsApp
                </a>
                <a
                  href={`tel:${PHONE}`}
                  className="btn-ghost-gold flex-1"
                  data-testid="detail-call-btn"
                >
                  <Phone size={16} strokeWidth={1.8} />
                  Call the Atelier
                </a>
              </div>

              <div className="mt-12 pt-8 border-t border-[#D4AF37]/15 space-y-3 text-sm font-light text-neutral-400">
                <div className="flex justify-between">
                  <span className="uppercase tracking-[0.2em] text-[10px] text-neutral-500">Crafted in</span>
                  <span>Mumbai, India</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-[0.2em] text-[10px] text-neutral-500">Customisation</span>
                  <span>Bespoke on request</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-[0.2em] text-[10px] text-neutral-500">Lead time</span>
                  <span>3 – 14 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
