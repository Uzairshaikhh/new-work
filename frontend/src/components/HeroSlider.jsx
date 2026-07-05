import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ShieldCheck, ArrowRight } from "lucide-react";
import { resolveMedia } from "../lib/api";
import { waLink } from "../lib/brand";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1668127494486-f27a1d2b88f9?crop=entropy&cs=srgb&fm=jpg&w=800&q=70";

const HeroSlider = ({ slides = [] }) => {
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

  // Reinitialize carousel when slides load in from API
  useEffect(() => {
    if (emblaApi && slides.length > 0) emblaApi.reInit();
  }, [emblaApi, slides]);

  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return;
    const id = setInterval(() => emblaApi.scrollNext(), 6500);
    return () => clearInterval(id);
  }, [emblaApi, slides.length]);

  const displaySlides = slides.length ? slides : [{ id: "fallback" }];

  return (
    <section className="relative hero-gradient overflow-hidden border-b border-[#d4af37]/15" data-testid="hero-slider">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {displaySlides.map((s) => (
            <div key={s.id} className="relative flex-[0_0_100%]" data-testid={`hero-slide-${s.id}`}>
              <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6">
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
                        "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=srgb&fm=jpg&w=80&q=60",
                        "https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=srgb&fm=jpg&w=80&q=60",
                        "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=srgb&fm=jpg&w=80&q=60",
                      ].map((u, i) => (
                        <img key={i} src={u} alt="" width={32} height={32} loading="lazy" decoding="async" className="w-8 h-8 rounded-full border-2 border-[#0a0a0d] object-cover" />
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Trusted by 500+ Businesses</div>
                      <div className="text-[10px] text-gray-400">From startups to Fortune 500</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 relative">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-[#d4af37]/20">
                    <img
                      src={s.image_url ? resolveMedia(s.image_url, 1200) : FALLBACK_IMAGE}
                      alt={s.title || "Corporate gift"}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      width={800}
                      height={600}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
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
