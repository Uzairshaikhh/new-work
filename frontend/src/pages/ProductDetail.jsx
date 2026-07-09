import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MessageCircle, Phone, Play, ShieldCheck, Truck, Package, Share2, Expand, X } from "lucide-react";
import { api, resolveMedia, track } from "../lib/api";
import { BRAND, waLink } from "../lib/brand";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import ImageLightbox from "../components/ImageLightbox";
import RecentlyViewed, { pushRecentlyViewed } from "../components/RecentlyViewed";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [related, setRelated] = useState([]);
  const [shared, setShared] = useState(false);

  useSEO({
    title: product?.name || "Product",
    description: product?.description?.slice(0, 160) || "Premium corporate gift from Amazing Groups Mumbai.",
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setRelated([]);
    setActiveImage(0);
    setShowVideo(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    api.get(`/products/${id}`)
      .then(async (r) => {
        if (!mounted) return;
        setProduct(r.data);
        track("product_view", { product_id: id, product_name: r.data.name });
        pushRecentlyViewed(r.data);
        try {
          const sameCat = await api.get(`/categories/${r.data.category_id}/products`);
          let pool = sameCat.data.filter((p) => p.id !== r.data.id);
          if (pool.length < 4) {
            const all = await api.get("/products");
            const extras = all.data.filter((p) => p.id !== r.data.id && !pool.some((q) => q.id === p.id));
            pool = [...pool, ...extras];
          }
          if (mounted) setRelated(pool.slice(0, 4));
        } catch {}
      })
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  const images = product?.images?.length > 0 ? product.images : product ? [product.image_url] : [];
  const waHref = product ? waLink(`Hi Amazing Groups, I'm interested in "${product.name}" (MOQ: ${product.moq || 1} pieces). Could you share more details and bulk pricing?`) : "#";

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = product?.name || "Amazing Groups Product";
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(url); setShared(true); setTimeout(() => setShared(false), 2000); } catch {}
    }
  }, [product]);

  const handleWAClick = useCallback(() => {
    track("whatsapp_click", { product_id: id, product_name: product?.name });
  }, [id, product]);

  const handleCallClick = useCallback(() => {
    track("call_click", { product_id: id, product_name: product?.name });
  }, [id, product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15151a]">
        <Navbar />
        <div className="pt-12 px-6 lg:px-10 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="aspect-square bg-[#1a1a22] rounded-2xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-12 bg-[#1a1a22] animate-pulse rounded w-3/4" />
              <div className="h-4 bg-[#1a1a22] animate-pulse rounded w-1/2" />
              <div className="h-32 bg-[#1a1a22] animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#15151a]">
        <Navbar />
        <div className="pt-40 text-center">
          <p className="text-gray-500 uppercase tracking-wider text-sm">Product not found</p>
          <Link to="/" className="btn-primary mt-8 inline-flex">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#15151a]" data-testid="product-detail-page">
      <Navbar />

      <div className="py-12 px-6 lg:px-10 pb-28 md:pb-12">
        <div className="max-w-[1400px] mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-amber-brand mb-8 transition-colors" data-testid="back-link">
            <ChevronLeft size={16} /> Back
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {/* Gallery */}
            <div data-testid="product-gallery">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#15151a] group cursor-zoom-in" onClick={() => !showVideo && setLightboxOpen(true)}>
                {showVideo && product.video_url ? (
                  <video
                    src={resolveMedia(product.video_url)}
                    controls
                    autoPlay
                    className="absolute inset-0 w-full h-full object-cover"
                    data-testid="product-video"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <img src={resolveMedia(images[activeImage])} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 right-3 w-9 h-9 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Expand size={15} className="text-white" />
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4 flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <button key={i} onClick={() => { setActiveImage(i); setShowVideo(false); }}
                    className={`w-20 h-20 overflow-hidden rounded-lg border-2 transition-all ${activeImage === i && !showVideo ? "border-amber-brand" : "border-[#d4af37]/15 hover:border-amber-brand/40"}`}
                    data-testid={`thumb-${i}`}>
                    <img src={resolveMedia(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                {product.video_url && (
                  <button onClick={() => setShowVideo(true)}
                    className={`w-20 h-20 flex items-center justify-center rounded-lg border-2 bg-[#14141a] transition-all ${showVideo ? "border-amber-brand text-amber-brand" : "border-[#d4af37]/15 text-white hover:border-amber-brand/40"}`}
                    data-testid="thumb-video">
                    <Play size={22} />
                  </button>
                )}
              </div>
            </div>

            {/* Info */}
            <div data-testid="product-info">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold">Amazing Groups</div>
                <button onClick={handleShare} title="Share this product" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-brand transition-colors">
                  {shared ? <><X size={13} /> Copied!</> : <><Share2 size={13} /> Share</>}
                </button>
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] mb-5">{product.name}</h1>
              {product.price && (
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-sm text-gray-500">Starting from</span>
                  <span className="font-display text-3xl text-amber-brand">{product.price}</span>
                </div>
              )}
              <p className="text-gray-200 leading-relaxed whitespace-pre-line mb-8 text-base">{product.description}</p>

              {/* Desktop CTA */}
              <div className="hidden md:flex flex-col sm:flex-row gap-3 mb-8">
                <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={handleWAClick} className="btn-amber flex-1" data-testid="detail-whatsapp-btn">
                  <MessageCircle size={16} /> Enquire via WhatsApp
                </a>
                <a href={`tel:${BRAND.phoneTel}`} onClick={handleCallClick} className="btn-primary flex-1" data-testid="detail-call-btn">
                  <Phone size={16} /> Call the Team
                </a>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: ShieldCheck, label: "GST Billing", sub: "Available" },
                  { icon: Truck, label: "Pan-India", sub: "Delivery" },
                  { icon: Package, label: "Bulk Orders", sub: "Welcome" },
                ].map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.label} className="bg-[#14141a] rounded-xl p-4 text-center border border-amber-soft/60">
                      <Icon size={20} className="text-amber-brand mx-auto mb-2" />
                      <div className="text-xs font-semibold text-white">{b.label}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">{b.sub}</div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-[#d4af37]/15 p-6 bg-[#0e0e13] space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">MOQ</span>
                  <span className="font-medium text-white">{product.moq || 1} Pieces</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Crafted in</span>
                  <span className="font-medium text-white">Mumbai, India</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Customisation</span>
                  <span className="font-medium text-white">Logo, packaging, colour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lead time</span>
                  <span className="font-medium text-white">3 – 14 days</span>
                </div>
              </div>

              {product.bulk_pricing?.length > 0 && (
                <div className="mt-6 rounded-2xl border border-[#d4af37]/15 bg-[#0e0e13] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Bulk Pricing</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {product.bulk_pricing.map((tier, index) => (
                      <div key={index} className="border border-[#d4af37]/15 rounded-xl p-4 text-center">
                        <div className="text-xs text-gray-500 mb-2">{tier.qty}+ pcs</div>
                        <div className="text-xl font-semibold text-amber-brand">{tier.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="py-20 md:py-24 px-6 lg:px-10 bg-[#0e0e13]" data-testid="related-products-section">
          <div className="max-w-[1400px] mx-auto">
            <SectionHeading eyebrow="You may also like" title="Suggested products" subtitle="Other corporate-favourite picks from our atelier." />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="related-products-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} compact />)}
            </div>
          </div>
        </section>
      )}

      <RecentlyViewed excludeId={id} />

      <Footer />

      {/* Sticky mobile CTA bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#d4af37]/20 bg-[#0a0a0d]/95 backdrop-blur-md">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWAClick}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold text-[#0a0a0d] bg-amber-brand"
          data-testid="sticky-whatsapp-btn"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
        <a
          href={`tel:${BRAND.phoneTel}`}
          onClick={handleCallClick}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold text-white bg-[#15151a]"
          data-testid="sticky-call-btn"
        >
          <Phone size={16} /> Call Us
        </a>
      </div>

      {/* Image lightbox */}
      {lightboxOpen && images.length > 0 && (
        <ImageLightbox
          images={images}
          activeIndex={activeImage}
          onClose={() => setLightboxOpen(false)}
          onNav={(idx) => setActiveImage(idx)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
