import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { resolveMedia } from "../lib/api";
import { waLink } from "../lib/brand";
import GoldenParticles from "./GoldenParticles";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1668127494486-f27a1d2b88f9?crop=entropy&cs=srgb&fm=jpg&w=800&q=70";

const TRUST_AVATARS = [
  "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=srgb&fm=jpg&w=80&q=60",
  "https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=srgb&fm=jpg&w=80&q=60",
  "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=srgb&fm=jpg&w=80&q=60",
];

const AmbientOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div
      className="absolute rounded-full opacity-[0.07] blur-3xl"
      style={{
        width: "55vw", height: "55vw",
        top: "-15%", right: "-10%",
        background: "radial-gradient(circle, #d4af37 0%, transparent 70%)",
        animation: "orb-a 18s ease-in-out infinite",
      }}
    />
    <div
      className="absolute rounded-full opacity-[0.05] blur-3xl"
      style={{
        width: "40vw", height: "40vw",
        bottom: "-10%", left: "-5%",
        background: "radial-gradient(circle, #d4af37 0%, transparent 70%)",
        animation: "orb-b 22s ease-in-out infinite",
      }}
    />
    <div
      className="absolute rounded-full opacity-[0.04] blur-2xl"
      style={{
        width: "25vw", height: "25vw",
        top: "40%", left: "45%",
        background: "radial-gradient(circle, rgba(212,175,55,0.8) 0%, transparent 70%)",
        animation: "orb-a 14s ease-in-out infinite reverse",
      }}
    />
  </div>
);

const HeroSlider = ({ slides = [] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 35 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo  = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setAnimKey((k) => k + 1);
    };
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

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
    <section
      className="relative overflow-hidden border-b border-[#d4af37]/12"
      style={{
        background:
          "radial-gradient(ellipse 90% 60% at 65% 20%, rgba(212,175,55,0.11), transparent 55%)," +
          "radial-gradient(ellipse 60% 50% at 20% 85%, rgba(212,175,55,0.07), transparent 65%)," +
          "linear-gradient(160deg, #0a0a0d 0%, #0f0f14 50%, #0a0a0d 100%)",
      }}
      data-testid="hero-slider"
    >
      {/* Ambient light orbs */}
      <AmbientOrbs />

      {/* Golden particles canvas */}
      <GoldenParticles />

      {/* Horizontal gold line at very top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent pointer-events-none" />

      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {displaySlides.map((s) => (
            <div key={s.id} className="relative flex-[0_0_100%]" data-testid={`hero-slide-${s.id}`}>
              <div className="max-w-[1320px] mx-auto px-6 lg:px-10 py-12 md:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

                {/* ── Text column ── */}
                <div className="lg:col-span-6 relative z-10" key={animKey}>
                  {/* Eyebrow */}
                  <div
                    className="pill-badge mb-5 inline-flex"
                    style={{ animationDelay: "0s", animation: "hero-text-in 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
                  >
                    <ShieldCheck size={11} /> India's Trusted B2B Gifting Partner
                  </div>

                  {/* Headline */}
                  <h1
                    className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] text-white leading-[1.08] mb-5"
                    style={{ animation: "hero-text-in 0.8s 0.1s cubic-bezier(0.22,1,0.36,1) both" }}
                  >
                    {s.title || "Premium Corporate Gifts"}{" "}
                    <span
                      className="text-gradient-gold"
                      style={{ animation: "hero-text-in 0.8s 0.15s cubic-bezier(0.22,1,0.36,1) both" }}
                    >
                      {s.highlight || "with Your Brand Identity"}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p
                    className="text-gray-300/90 text-sm md:text-base leading-relaxed mb-7 max-w-md"
                    style={{ animation: "hero-text-in 0.8s 0.2s cubic-bezier(0.22,1,0.36,1) both" }}
                  >
                    {s.subtitle || "Custom printed wallets, bottles, diaries & more — perfect for bulk corporate orders. Premium quality, on-time delivery."}
                  </p>

                  {/* CTA buttons */}
                  <div
                    className="flex flex-wrap gap-3 mb-8"
                    style={{ animation: "hero-text-in 0.8s 0.28s cubic-bezier(0.22,1,0.36,1) both" }}
                  >
                    <a
                      href="#products"
                      className="btn-primary !py-3 !px-6"
                      data-testid={`hero-cta-primary-${s.id}`}
                    >
                      Explore Products <ArrowRight size={15} />
                    </a>
                    <a
                      href={waLink("Hi Amazing Groups, I'd like a bulk quote.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-amber !py-3 !px-6"
                      data-testid={`hero-cta-secondary-${s.id}`}
                    >
                      Get Bulk Quote
                    </a>
                  </div>

                  {/* Social proof */}
                  <div
                    className="flex items-center gap-4"
                    style={{ animation: "hero-text-in 0.8s 0.36s cubic-bezier(0.22,1,0.36,1) both" }}
                  >
                    <div className="flex -space-x-2.5">
                      {TRUST_AVATARS.map((u, i) => (
                        <img
                          key={i}
                          src={u}
                          alt=""
                          width={34}
                          height={34}
                          loading="lazy"
                          decoding="async"
                          className="w-8 h-8 rounded-full border-2 border-[#0a0a0d] object-cover"
                        />
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <Sparkles size={11} className="text-amber-brand" />
                        Trusted by 500+ Businesses
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">From startups to Fortune 500</div>
                    </div>
                  </div>
                </div>

                {/* ── Image column ── */}
                <div
                  className="lg:col-span-6 relative"
                  style={{ animation: "hero-text-in 0.9s 0.12s cubic-bezier(0.22,1,0.36,1) both" }}
                >
                  {/* Glow halo behind image */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(212,175,55,0.12), transparent 70%)",
                      filter: "blur(24px)",
                      transform: "scale(1.15)",
                    }}
                  />

                  <div className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.7)] border border-[#d4af37]/18">
                    <img
                      src={s.image_url ? resolveMedia(s.image_url, 1200) : FALLBACK_IMAGE}
                      alt={s.title || "Corporate gift"}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      width={800}
                      height={600}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    {/* Inner overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 via-transparent to-[#0a0a0d]/30 pointer-events-none" />
                    {/* Bottom reflection line */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
                  </div>

                  {/* Floating accent card */}
                  <div
                    className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xl hidden md:flex"
                    style={{ animation: "float 6s 1s ease-in-out infinite" }}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#d4af37]/15 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={14} className="text-amber-brand" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white">GST Billing</div>
                      <div className="text-[9px] text-gray-500">Available on all orders</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Previous slide"
            data-testid="hero-prev"
            className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center glass-dark border border-[#d4af37]/25 rounded-full text-amber-brand hover:border-[#d4af37]/70 hover:bg-[#d4af37]/10 transition-all duration-300"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next slide"
            data-testid="hero-next"
            className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center glass-dark border border-[#d4af37]/25 rounded-full text-amber-brand hover:border-[#d4af37]/70 hover:bg-[#d4af37]/10 transition-all duration-300"
          >
            <ChevronRight size={17} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2" data-testid="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-500 ${
                  selectedIndex === i
                    ? "w-7 h-1.5 bg-[#d4af37]"
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0a0a0d] to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSlider;
