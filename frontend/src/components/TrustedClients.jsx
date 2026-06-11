import { Palette, Package, Boxes, Percent, MessageCircle, ArrowRight } from "lucide-react";

const TrustedClients = ({ settings }) => {
  const title =
  settings?.trusted_clients_title ||
  "Trusted by Businesses Across India";

const stats =
  settings?.trusted_clients_stats ||
  "We've served 500+ companies for bulk gifting needs.";

const brands =
  settings?.trusted_clients_brands || [
    "TATA",
    "Infosys",
    "HDFC BANK",
    "ICICI Bank",
    "Deloitte",
    "Wipro",
  ];

  return (
    <section className="py-8 px-6 lg:px-10">
      <div className="max-w-[1280px] mx-auto rounded-lg border border-[#d4af37]/20 bg-[#15151a] py-5 px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-center md:text-left flex-shrink-0">
            <div className="font-display text-base text-white leading-tight">
              {title}
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-8 flex-wrap justify-center flex-1">
            {brands.map((brand) => (
              <div
                key={brand}
                className="font-display font-bold text-base md:text-lg text-gray-500 hover:text-amber-brand transition-colors whitespace-nowrap tracking-tight"
              >
                {brand}
              </div>
            ))}
          </div>

          <div className="text-[11px] text-gray-400 text-center md:text-right flex-shrink-0 max-w-[140px] leading-relaxed">
            {stats}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedClients;