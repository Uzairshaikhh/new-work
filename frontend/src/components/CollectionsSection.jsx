import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, resolveMedia } from "../lib/api";
import { Sparkles, Building2, Calendar } from "lucide-react";

const TYPE_ICONS = {
  festival:  { icon: Calendar,  label: "Festival" },
  corporate: { icon: Building2, label: "Corporate" },
  industry:  { icon: Sparkles,  label: "Industry" },
  custom:    { icon: Sparkles,  label: "Collection" },
};

const CollectionCard = ({ col }) => {
  const { icon: Icon, label } = TYPE_ICONS[col.type] || TYPE_ICONS.custom;
  return (
    <Link
      to={`/collections/${col.id}`}
      className="group relative overflow-hidden rounded-xl bg-[#15151a] border border-[#d4af37]/15 hover:border-[#d4af37]/50 transition-all duration-300 block"
    >
      {col.image_url ? (
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={resolveMedia(col.image_url, 500)}
            alt={col.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d]/90 via-[#0a0a0d]/30 to-transparent" />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-[#15151a] to-[#0e0e13] flex items-center justify-center">
          <Icon size={36} className="text-amber-brand/30" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4">
        {col.badge && (
          <span className="inline-block bg-amber-brand text-[#0a0a0d] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2">
            {col.badge}
          </span>
        )}
        <div className="flex items-center gap-1.5 mb-1">
          <Icon size={11} className="text-amber-brand" />
          <span className="text-[9px] uppercase tracking-wider text-amber-brand font-semibold">{label}</span>
        </div>
        <h3 className="font-display text-lg text-white leading-tight">{col.title}</h3>
        {col.description && <p className="text-gray-400 text-xs mt-1 line-clamp-2">{col.description}</p>}
        <div className="text-xs text-amber-brand mt-2 group-hover:translate-x-1 transition-transform inline-block">
          View Collection →
        </div>
      </div>
    </Link>
  );
};

const CollectionsSection = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    api.get("/collections").then((r) => setCollections(r.data)).catch(() => {});
  }, []);

  if (collections.length === 0) return null;

  const festival  = collections.filter((c) => c.type === "festival");
  const corporate = collections.filter((c) => c.type === "corporate");
  const others    = collections.filter((c) => c.type !== "festival" && c.type !== "corporate");

  const allGroups = [
    festival.length  ? { label: "Festival Collections",  items: festival  } : null,
    corporate.length ? { label: "Corporate Collections", items: corporate } : null,
    others.length    ? { label: "More Collections",      items: others    } : null,
  ].filter(Boolean);

  return (
    <>
      {allGroups.map((group) => (
        <section key={group.label} className="py-10 px-6 lg:px-10">
          <div className="max-w-[1280px] mx-auto">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-display text-xl md:text-2xl lg:text-3xl text-white">{group.label}</h2>
              <Link to="/collections" className="text-xs font-semibold text-amber-brand hover:underline">
                See All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {group.items.slice(0, 4).map((col) => (
                <CollectionCard key={col.id} col={col} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default CollectionsSection;
