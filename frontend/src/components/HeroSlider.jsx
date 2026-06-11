import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { resolveMedia } from "../lib/api";
import { waLink } from "../lib/brand";

const HeroSlider = ({ slides = [], loading = false }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 35 });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return;
    const id = setInterval(() => emblaApi.scrollNext(), 6500);
    return () => clearInterval(id);
  }, [emblaApi, slides.length]);

  if (loading) {
    return <div className="w-full h-[460px] hero-gradient animate-pulse" data-testid="hero-skeleton" />;
  }

  return (
    <section className="relative hero-gradient overflow-hidden border-b border-[#d4af37]/15" data-testid="hero-slider">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {(slides.length ? slides : [{ id: "fallback" }]).map((s) => (
            <div key={s.id} className="relative flex-[0_0_100%]" data-testid={`hero-slide-${s.id}`}>
              <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 animate-fade-up">
                  <div className="pill-badge mb-4">
                    <ShieldCheck size={12} /> India's Trusted B2B Gifting Partner
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.1] mb-4">
                    {s.title || "Premium Corporate Gifts"}{" "}
                    <span className="text-amber-brand">{s.highlight || "with Your Brand Identity"}</span>
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 max-w-md">
                    {s.subtitle ||
                      "Custom printed wallets, bottles, diaries & more — perfect for bulk corporate orders. Premium quality, on-time delivery."}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a href="#products" className="btn-primary !py-2.5 !px-5 !text-sm" data-testid={`hero-cta-primary-${s.id}`}>
                      Explore Products <ArrowRight size={14} />
                    </a>
                    <a
                      href={waLink("Hi Amazing Groups, I'd like a bulk quote.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-amber !py-2.5 !px-5 !text-sm"
                      data-testid={`hero-cta-secondary-${s.id}`}
                    >
                      Get Bulk Quote
                    </a>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[
                        "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=srgb&fm=jpg&w=80&q=80",
                        "https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=srgb&fm=jpg&w=80&q=80",
                        "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=srgb&fm=jpg&w=80&q=80",
                      ].map((u, i) => (
                        <img key={i} src={u} alt="" className="w-8 h-8 rounded-full border-2 border-[#0a0a0d] object-cover" />
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Trusted by 500+ Businesses</div>
                      <div className="text-[10px] text-gray-400">From startups to Fortune 500</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative animate-fade-up" style={{ animationDelay: "150ms" }}>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-[#d4af37]/20">
                    <img
  src={
    s.image_url
      ? resolveMedia(s.image_url)
      : "https://images.unsplash.com/photo-1668127494486-f27a1d2b88f9?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85"
  }
  alt={s.title || "Corporate gift"}
  loading="eager"
  fetchPriority="high"
  decoding="async"
  className="absolute inset-0 w-full h-full object-cover"
/>
                  </div>
                  <div
                    className="absolute -bottom-4 left-4 bg-[#15151a] rounded-lg px-3.5 py-2.5 shadow-xl border border-[#d4af37]/30 flex items-center gap-2"
                    data-testid="hero-price-card"
                  >
                    <Sparkles size={16} className="text-amber-brand" />
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">Starting from</div>
                      <div className="text-base font-display text-white">
                        ₹80 <span className="text-xs text-gray-400 font-medium">/piece</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            data-testid="hero-prev"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center bg-[#15151a] border border-[#d4af37]/30 rounded-full text-amber-brand hover:bg-amber-brand hover:text-[#0a0a0d] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            data-testid="hero-next"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center bg-[#15151a] border border-[#d4af37]/30 rounded-full text-amber-brand hover:bg-amber-brand hover:text-[#0a0a0d] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5" data-testid="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-500 ${
                  selectedIndex === i ? "w-8 bg-amber-brand" : "w-2.5 bg-white/20"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSlider;
