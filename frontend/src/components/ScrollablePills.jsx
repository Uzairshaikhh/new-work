import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ScrollablePills = ({ children }) => {
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const check = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", check); ro.disconnect(); };
  }, [check]);

  // Re-check when children change (categories loaded)
  useEffect(() => { check(); });

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-1">
      {canLeft && (
        <button
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          className="flex-shrink-0 w-7 h-7 rounded-full bg-[#15151a] border border-[#d4af37]/25 text-amber-brand flex items-center justify-center hover:bg-[#d4af37]/10 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
      )}

      {/* Fade masks */}
      {canLeft && (
        <div className="absolute left-8 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0a0d] to-transparent pointer-events-none z-10" />
      )}
      {canRight && (
        <div className="absolute right-8 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0d] to-transparent pointer-events-none z-10" />
      )}

      <div
        ref={trackRef}
        className="flex items-center gap-2.5 overflow-x-auto flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>

      {canRight && (
        <button
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          className="flex-shrink-0 w-7 h-7 rounded-full bg-[#15151a] border border-[#d4af37]/25 text-amber-brand flex items-center justify-center hover:bg-[#d4af37]/10 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

export default ScrollablePills;
