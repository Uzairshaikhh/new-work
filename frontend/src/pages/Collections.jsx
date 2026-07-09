import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Building2, Sparkles, ChevronLeft } from "lucide-react";
import { api, resolveMedia } from "../lib/api";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TYPE_META = {
  festival:  { icon: Calendar,  label: "Festival", color: "from-orange-900/30" },
  corporate: { icon: Building2, label: "Corporate", color: "from-blue-900/30" },
  industry:  { icon: Sparkles,  label: "Industry",  color: "from-purple-900/30" },
  custom:    { icon: Sparkles,  label: "Custom",    color: "from-[#d4af37]/10" },
};

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useSEO({
    title: "Collections — Amazing Groups",
    description: "Browse our curated collections — festival gifts, corporate kits, industry-specific gifting and more.",
  });

  useEffect(() => {
    api.get("/collections").then((r) => setCollections(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const visible = filter === "all" ? collections : collections.filter((c) => c.type === filter);
  const types = [...new Set(collections.map((c) => c.type))];

  return (
    <div className="min-h-screen bg-[#0a0a0d]">
      <Navbar />

      <section className="hero-gradient border-b border-[#d4af37]/15 py-10 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-amber-brand mb-5 transition-colors">
            <ChevronLeft size={15} /> Home
          </Link>
          <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">Curated</div>
          <h1 className="font-display text-3xl md:text-4xl text-white mb-2">Collections</h1>
          <p className="text-gray-400 text-sm">Handpicked gift sets for every occasion, industry, and season.</p>
        </div>
      </section>

      {/* Filter */}
      {types.length > 1 && (
        <div className="border-b border-[#d4af37]/10 px-6 lg:px-10 py-3">
          <div className="max-w-[1280px] mx-auto flex items-center gap-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {["all", ...types].map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                filter === t
                  ? "bg-amber-brand text-[#0a0a0d] border-amber-brand"
                  : "text-white/70 border-[#d4af37]/25 hover:border-amber-brand hover:text-white"
              }`}>
                {t === "all" ? "All" : TYPE_META[t]?.label || t}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="py-8 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/3] bg-[#15151a] animate-pulse rounded-xl" />)}
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-[#d4af37]/20 rounded-xl">
              <Sparkles size={32} className="text-amber-brand/30 mx-auto mb-3" />
              <p className="text-gray-500 text-sm uppercase tracking-wider">No collections yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((col) => {
                const meta = TYPE_META[col.type] || TYPE_META.custom;
                const Icon = meta.icon;
                return (
                  <Link key={col.id} to={`/collections/${col.id}`} className="group relative overflow-hidden rounded-xl bg-[#15151a] border border-[#d4af37]/15 hover:border-[#d4af37]/50 transition-all duration-300 block">
                    {col.image_url ? (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={resolveMedia(col.image_url, 600)} alt={col.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d]/90 via-[#0a0a0d]/20 to-transparent" />
                      </div>
                    ) : (
                      <div className={`aspect-[4/3] bg-gradient-to-br ${meta.color} to-transparent flex items-center justify-center`}>
                        <Icon size={40} className="text-amber-brand/20" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      {col.badge && <span className="inline-block bg-amber-brand text-[#0a0a0d] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2">{col.badge}</span>}
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={11} className="text-amber-brand" />
                        <span className="text-[9px] uppercase tracking-wider text-amber-brand font-semibold">{meta.label}</span>
                      </div>
                      <h3 className="font-display text-xl text-white">{col.title}</h3>
                      {col.description && <p className="text-gray-400 text-xs mt-1 line-clamp-2">{col.description}</p>}
                      {col.product_ids?.length > 0 && (
                        <p className="text-[10px] text-gray-600 mt-2">{col.product_ids.length} product{col.product_ids.length !== 1 ? "s" : ""}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Collections;
