import { useEffect, useRef } from "react";

const SectionHeading = ({ eyebrow, title, subtitle, align = "center" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("is-visible"); observer.disconnect(); } },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"} mb-10`}
    >
      {eyebrow && (
        <div className="eyebrow mb-3 flex items-center gap-2 justify-center">
          <span className="inline-block w-5 h-px bg-[#d4af37]/50" />
          {eyebrow}
          <span className="inline-block w-5 h-px bg-[#d4af37]/50" />
        </div>
      )}
      <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-white leading-[1.12]">
        {title}
      </h2>
      {/* Gold underline accent */}
      {align === "center" && (
        <div className="mt-4 flex justify-center">
          <div className="divider-gold" />
        </div>
      )}
      {subtitle && (
        <p className="text-white/45 text-sm md:text-base leading-relaxed mt-5 max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
