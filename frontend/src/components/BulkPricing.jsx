import { Palette, Package, Boxes, Percent, MessageCircle } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { waLink } from "../lib/brand";

const FEATURES = [
  { icon: Palette, title: "Logo Printing", body: "High-quality branding on every piece." },
  { icon: Package, title: "Custom Packaging", body: "Premium gift packaging options." },
  { icon: Boxes, title: "Multiple Colours", body: "Choose from a curated palette." },
  { icon: Percent, title: "Bulk Discounts", body: "Pricing that scales with quantity." },
];

const TIERS = [
  { qty: "100+ pcs", price: "₹120", label: "Starter" },
  { qty: "500+ pcs", price: "₹95", label: "Growth" },
  { qty: "1000+ pcs", price: "₹80", label: "Popular" },
  { qty: "5000+ pcs", price: "₹65", label: "Enterprise" },
];

const BulkPricing = () => {
  const waHref = waLink("Hi Amazing Groups, I'd like a custom bulk quote.");

  return (
    <section className="py-20 md:py-28 px-6 lg:px-10 bg-[#15151a]" data-testid="bulk-pricing-section">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeading
          eyebrow="Volume Pricing"
          title="Save more with bulk orders"
          subtitle="Higher the quantity, lower the price. Indicative tiers shown — final pricing depends on product, branding and packaging."
        />

        {/* Tiers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {TIERS.map((t, i) => (
            <div
              key={t.qty}
              className={`relative rounded-2xl p-6 text-center transition-all ${
                i === 2
                  ? "bg-navy text-white shadow-2xl shadow-navy/20 scale-[1.03]"
                  : "bg-[#14141a] border border-amber-soft/60"
              }`}
              data-testid={`bulk-tier-${t.qty.replace(/\s+/g, "-")}`}
            >
              {i === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-brand text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className={`text-xs uppercase tracking-wider font-semibold mb-2 ${i === 2 ? "text-amber-brand" : "text-gray-500"}`}>
                {t.label}
              </div>
              <div className={`font-display text-2xl mb-1 ${i === 2 ? "text-white" : "text-white"}`}>
                {t.qty}
              </div>
              <div className={`text-[11px] uppercase tracking-wider mb-3 ${i === 2 ? "text-white/60" : "text-gray-500"}`}>
                Price per piece
              </div>
              <div className={`font-display text-3xl ${i === 2 ? "text-amber-brand" : "text-amber-brand"}`}>
                {t.price}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-[#0e0e13] rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl md:text-3xl text-white mb-3">
              Make it yours — customise your products
            </h3>
            <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
              Every product can be personalised with your brand, packaging and colour preferences.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-[#15151a] rounded-2xl p-6 text-center card-shadow"
                  data-testid={`customize-feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-[#d4af37]/15 text-amber-brand flex items-center justify-center mb-4">
                    <Icon size={20} />
                  </div>
                  <div className="font-display text-base text-white mb-1">{f.title}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{f.body}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-amber" data-testid="bulk-quote-cta">
              <MessageCircle size={16} /> Request Custom Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BulkPricing;
