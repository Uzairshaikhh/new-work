import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveMedia } from "../lib/api";

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
    const id = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(id);
  }, [emblaApi, slides.length]);

  if (loading) {
    return (
      <div className="relative w-full h-[92vh] bg-[#111] animate-pulse" data-testid="hero-skeleton" />
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[92vh] bg-[#0a0a0a] flex items-center justify-center grain" data-testid="hero-empty">
        <div className="text-center px-6">
          <div className="eyebrow mb-6">Amazing Groups</div>
          <h1 className="font-display text-5xl md:text-7xl text-white">Bespoke Gifts, Crafted With Intention</h1>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full" data-testid="hero-slider">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((s) => (
            <div
              key={s.id}
              className="relative flex-[0_0_100%] h-[92vh] min-h-[600px]"
              data-testid={`hero-slide-${s.id}`}
            >
              <img
                src={resolveMedia(s.image_url)}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
              <div className="absolute inset-0 bg-[#0a0a0a]/40" />
              <div className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-center">
                <div className="max-w-xl animate-fade-up">
                  <div className="eyebrow mb-6">Amazing Groups · Mumbai</div>
                  <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
                    {s.title}
                  </h1>
                  {s.subtitle && (
                    <p className="text-base md:text-lg text-neutral-300 font-light leading-relaxed mb-10 max-w-md">
                      {s.subtitle}
                    </p>
                  )}
                  <a
                    href={s.cta_link || "#categories"}
                    className="btn-gold"
                    data-testid={`hero-cta-${s.id}`}
                  >
                    {s.cta_label || "Explore"}
                  </a>
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
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a0a0a] transition-all duration-300"
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            data-testid="hero-next"
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0a0a0a] transition-all duration-300"
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3" data-testid="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-[2px] transition-all duration-500 ${
                  selectedIndex === i ? "w-12 bg-[#D4AF37]" : "w-6 bg-white/30"
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
