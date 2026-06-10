import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Palette, Package, Boxes, Percent, MessageCircle, ArrowRight } from "lucide-react";
import { waLink } from "../lib/brand";

const FEATURES = [
  { icon: Palette, title: "Logo Printing", body: "High quality branding" },
  { icon: Package, title: "Custom Packaging", body: "Premium packaging" },
  { icon: Boxes, title: "Multiple Colours", body: "Choose your palette" },
  { icon: Percent, title: "Bulk Discounts", body: "Scales with quantity" },
];

const STEPS = [
  { n: "1", title: "Choose Product", body: "Pick your favourite product" },
  { n: "2", title: "Share Logo / Requirements", body: "Send us your logo & details" },
  { n: "3", title: "Get Quote & Mockup", body: "We provide quote & mockup" },
  { n: "4", title: "Confirm & Delivery", body: "Confirm order & get fast delivery" },
];



const BulkPricing = () => {
  const [tiers, setTiers] = useState([]);

useEffect(() => {
  api.get("/settings").then((r) => {
    if (r.data?.bulk_pricing) {
      setTiers(r.data.bulk_pricing);
    }
  });
}, []);
  const waHref = waLink("Hi Amazing Groups, I'd like a custom bulk quote.");

  return (
    <>
      {/* Bulk pricing table — single compact panel */}
      <section className="py-10 px-6 lg:px-10" data-testid="bulk-pricing-section">
        <div className="max-w-[1280px] mx-auto">
          <div className="rounded-lg border border-[#d4af37]/30 bg-[#15151a] p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4">
              <h3 className="font-display text-2xl md:text-3xl text-white leading-tight">
                Save More with <br /> Bulk Orders
              </h3>
              <p className="text-sm text-gray-400 mt-3">
                Higher the quantity, lower the price. Best rates for businesses!
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-5 gap-0 border border-[#d4af37]/30 rounded-md overflow-hidden mb-4">
                <div className="bg-[#0e0e13] py-3 px-3 text-[10px] uppercase tracking-wider text-amber-brand font-semibold text-center border-r border-[#d4af37]/20">
                  Quantity
                </div>
                {tiers.map((t) => (
                  <div key={t.qty} className="bg-[#0e0e13] py-3 px-2 text-xs text-white text-center font-semibold border-r border-[#d4af37]/20 last:border-r-0">
                    {t.qty}
                  </div>
                ))}
                <div className="py-3 px-3 text-[10px] uppercase tracking-wider text-gray-400 font-semibold text-center border-r border-t border-[#d4af37]/20">
                  Price / Piece
                </div>
                {tiers.map((t) => (
                  <div key={t.price} className="py-3 px-2 text-amber-brand text-center font-display text-sm border-r border-t border-[#d4af37]/20 last:border-r-0">
                    {t.price}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5 !px-5 !text-sm" data-testid="bulk-quote-cta">
                  Request Custom Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customize + How to Order — side by side */}
      <section id="how-to-order" className="py-10 px-6 lg:px-10" data-testid="customize-how-section">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Customize */}
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#15151a] p-6">
            <h3 className="font-display text-lg md:text-xl text-white mb-1 text-center">
              Make It Yours — Customize Your Products
            </h3>
            <div className="divider-gold mx-auto my-3" />
            <div className="grid grid-cols-2 gap-3 mt-4">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-2.5" data-testid={`customize-feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="w-8 h-8 rounded-md border border-[#d4af37]/30 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-amber-brand" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white leading-tight">{f.title}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{f.body}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 text-center">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2 !px-4 !text-xs" data-testid="customize-cta">
                Upload Your Logo
              </a>
            </div>
          </div>

          {/* How To Order */}
          <div className="rounded-lg border border-[#d4af37]/20 bg-[#15151a] p-6">
            <h3 className="font-display text-lg md:text-xl text-white mb-1 text-center">How to Order</h3>
            <div className="divider-gold mx-auto my-3" />
            <div className="grid grid-cols-4 gap-2 mt-4 relative">
              {STEPS.map((s, i) => (
                <div key={s.n} className="text-center" data-testid={`order-step-${s.n}`}>
                  <div className="relative mx-auto w-8 h-8 rounded-full bg-amber-brand text-[#0a0a0d] flex items-center justify-center font-display text-xs mb-2 shadow-md shadow-amber-brand/30">
                    {s.n}
                    {i < STEPS.length - 1 && (
                      <ArrowRight size={12} className="absolute -right-3.5 top-1/2 -translate-y-1/2 text-amber-brand/60 hidden md:block" />
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-white leading-tight">{s.title}</div>
                  <div className="text-[9px] text-gray-400 mt-1 leading-tight">{s.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BulkPricing;
