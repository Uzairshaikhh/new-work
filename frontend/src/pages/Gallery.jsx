import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { api, resolveMedia } from "../lib/api";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageLightbox from "../components/ImageLightbox";

const SECTIONS = [
  { key: "all", label: "All" },
  { key: "products", label: "Products" },
  { key: "corporate", label: "Corporate Orders" },
  { key: "packaging", label: "Packaging" },
  { key: "events", label: "Events" },
  { key: "customer_photos", label: "Customer Photos" },
  { key: "process", label: "Our Process" },
];

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("all");
  const [lightbox, setLightbox] = useState({ open: false, idx: 0 });

  useSEO({
    title: "Gallery — Amazing Groups",
    description: "Browse our gallery of premium corporate gifts, custom packaging, events and happy customer photos.",
  });

  useEffect(() => {
    api.get("/gallery").then((r) => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    active === "all" ? items : items.filter((i) => i.section === active),
    [items, active]
  );

  const images = useMemo(() => filtered.map((i) => i.image_url), [filtered]);

  const openLightbox = useCallback((idx) => setLightbox({ open: true, idx }), []);
  const closeLightbox = useCallback(() => setLightbox({ open: false, idx: 0 }), []);
  const navLightbox = useCallback((idx) => setLightbox((prev) => ({ ...prev, idx })), []);

  return (
    <div className="min-h-screen bg-[#0a0a0d]">
      <Navbar />

      {/* Header */}
      <section className="hero-gradient border-b border-[#d4af37]/15 py-10 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-amber-brand mb-5 transition-colors">
            <ChevronLeft size={15} /> Back to Home
          </Link>
          <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">Showcase</div>
          <h1 className="font-display text-3xl md:text-4xl text-white mb-2">Our Gallery</h1>
          <p className="text-gray-400 text-sm">Real orders, real smiles — a showcase of our work across India.</p>
        </div>
      </section>

      {/* Section filter */}
      <div className="border-b border-[#d4af37]/10 bg-[#0a0a0d] px-6 lg:px-10 py-3">
        <div className="max-w-[1280px] mx-auto flex items-center gap-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                active === s.key
                  ? "bg-amber-brand text-[#0a0a0d] border-amber-brand"
                  : "bg-transparent text-white/70 border-[#d4af37]/25 hover:border-amber-brand hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="py-8 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-[#15151a] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#d4af37]/20 rounded-lg">
              <p className="text-gray-400 text-xs uppercase tracking-wider">No photos in this section yet</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
              {filtered.map((item, i) => (
                <div
                  key={item.id || i}
                  className="break-inside-avoid cursor-zoom-in group relative overflow-hidden rounded-lg bg-[#15151a]"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={resolveMedia(item.image_url, 600)}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {(item.title || item.description) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      {item.title && <p className="text-white text-xs font-semibold line-clamp-1">{item.title}</p>}
                      {item.description && <p className="text-gray-300 text-[10px] line-clamp-1">{item.description}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {lightbox.open && (
        <ImageLightbox
          images={images}
          activeIndex={lightbox.idx}
          onClose={closeLightbox}
          onNav={navLightbox}
        />
      )}
    </div>
  );
};

export default Gallery;
