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
    return <div className="w-full h-[600px] hero-gradient animate-pulse" data-testid="hero-skeleton" />;
  }

  return (
    <section className="relative hero-gradient overflow-hidden" data-testid="hero-slider">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {(slides.length ? slides : [{ id: "fallback" }]).map((s) => (
            <div
              key={s.id}
              className="relative flex-[0_0_100%]"
              data-testid={`hero-slide-${s.id}`}
            >
              <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* Left content */}
                <div className="animate-fade-up">
                  <div className="pill-badge mb-6">
                    <ShieldCheck size={14} />
                    India's Trusted B2B Gifting Partner
                  </div>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-6">
                    {s.title || "Premium Corporate Gifts"}{" "}
                    <span className="text-amber-brand">
                      {s.highlight || "with Your Brand Identity"}
                    </span>
                  </h1>
                  <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
                    {s.subtitle ||
                      "Custom printed wallets, bottles, diaries & more — perfect for bulk corporate orders. Premium quality, on-time delivery, and pan-India reach."}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="#products"
                      className="btn-primary"
                      data-testid={`hero-cta-primary-${s.id}`}
                    >
                      Explore Products <ArrowRight size={16} />
                    </a>
                    <a
                      href={waLink("Hi Amazing Groups, I'd like a bulk quote.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-amber"
                      data-testid={`hero-cta-secondary-${s.id}`}
                    >
                      Get Bulk Quote
                    </a>
                  </div>

                  <div className="mt-10 flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[
                        "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=srgb&fm=jpg&w=80&q=80",
                        "https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=srgb&fm=jpg&w=80&q=80",
                        "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=srgb&fm=jpg&w=80&q=80",
                      ].map((u, i) => (
                        <img
                          key={i}
                          src={u}
                          alt=""
                          className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Trusted by 500+ Businesses</div>
                      <div className="text-xs text-gray-500">From startups to Fortune 500</div>
                    </div>
                  </div>
                </div>

                {/* Right image card */}
                <div className="relative animate-fade-up" style={{ animationDelay: "150ms" }}>
                  <div className="relative aspect-[5/4] rounded-2xl overflow-hidden shadow-2xl shadow-navy/10">
                    <img
                      src={
                        s.image_url
                          ? resolveMedia(s.image_url)
                          : "https://images.unsplash.com/photo-1668127494486-f27a1d2b88f9?crop=entropy&cs=srgb&fm=jpg&w=1200&q=85"
                      }
                      alt={s.title || "Corporate gift"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  {/* Floating starting price card */}
                  <div className="absolute -bottom-6 left-6 bg-[#15151a] rounded-xl px-5 py-4 shadow-xl card-shadow flex items-center gap-3" data-testid="hero-price-card">
                    <Sparkles size={20} className="text-amber-brand" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Starting from</div>
                      <div className="text-xl font-display text-white">
                        ₹80 <span className="text-sm text-gray-500 font-medium">/piece</span>
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
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center bg-[#15151a] rounded-full shadow-lg text-white hover:text-amber-brand transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            data-testid="hero-next"
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center bg-[#15151a] rounded-full shadow-lg text-white hover:text-amber-brand transition-colors"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2" data-testid="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  selectedIndex === i ? "w-10 bg-amber-brand" : "w-3 bg-navy/20"
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
