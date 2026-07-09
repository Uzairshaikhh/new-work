import { Phone, MessageCircle } from "lucide-react";
import { BRAND, waLink } from "../lib/brand";

const FloatingDock = () => {
  const waHref = waLink("Hi Amazing Groups, I'd like to enquire about bulk corporate gifting.");

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-3 items-end">
      {/* Call button */}
      <a
        href={`tel:${BRAND.phoneTel}`}
        aria-label="Call us"
        className="group flex items-center gap-2.5 bg-[#15151a] border border-[#d4af37]/30 text-amber-brand rounded-full shadow-lg hover:bg-amber-brand hover:text-[#0a0a0d] transition-all duration-300 overflow-hidden"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[160px] transition-all duration-300 ease-in-out pl-0 group-hover:pl-4 text-xs font-semibold">
          {BRAND.phoneDisplay}
        </span>
        <span className="w-12 h-12 flex items-center justify-center flex-shrink-0">
          <Phone size={18} />
        </span>
      </a>

      {/* WhatsApp button */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp us"
        className="group flex items-center gap-2.5 bg-[#25d366] text-white rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-300 overflow-hidden"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[160px] transition-all duration-300 ease-in-out pl-0 group-hover:pl-4 text-xs font-semibold">
          Chat on WhatsApp
        </span>
        <span className="w-12 h-12 flex items-center justify-center flex-shrink-0">
          <MessageCircle size={20} />
        </span>
      </a>
    </div>
  );
};

export default FloatingDock;
