import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { resolveMedia } from "../lib/api";

const ImageLightbox = ({ images, activeIndex, onClose, onNav }) => {
  const prev = useCallback(() => onNav((activeIndex - 1 + images.length) % images.length), [activeIndex, images.length, onNav]);
  const next = useCallback(() => onNav((activeIndex + 1) % images.length), [activeIndex, images.length, onNav]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
          {activeIndex + 1} / {images.length}
        </div>
      )}

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Image */}
      <img
        src={resolveMedia(images[activeIndex], 1600)}
        alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain select-none"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={22} />
        </button>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); onNav(i); }}
              className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${i === activeIndex ? "border-amber-brand" : "border-white/20 opacity-50 hover:opacity-80"}`}
            >
              <img src={resolveMedia(img, 200)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;
