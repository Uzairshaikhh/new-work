import { Phone, Mail, MapPin, ExternalLink, Info } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { BRAND } from "../lib/brand";

const ContactSection = () => {
  const items = [
    { icon: Phone, label: "Call us", value: BRAND.phoneDisplay, href: `tel:${BRAND.phoneTel}`, testid: "contact-phone" },
    { icon: Mail, label: "Email us", value: BRAND.email, href: `mailto:${BRAND.email}`, testid: "contact-email" },
    { icon: MapPin, label: "Visit us", value: BRAND.locationLabel, href: BRAND.mapUrl, testid: "contact-location" },
  ];

  return (
    <section id="contact" className="py-10 px-6 lg:px-10" data-testid="contact-section">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeading eyebrow="Get In Touch" title="Contact Us" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <a
                key={it.label}
                href={it.href}
                target={it.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                data-testid={it.testid}
                className="group bg-[#15151a] rounded-lg p-5 border border-[#d4af37]/15 hover:border-[#d4af37]/45 transition-all flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-md bg-[#d4af37]/12 text-amber-brand flex items-center justify-center flex-shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{it.label}</div>
                  <div className="font-display text-sm text-white group-hover:text-amber-brand transition-colors break-words leading-tight mt-0.5">
                    {it.value}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <a href={BRAND.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5 !px-5 !text-sm" data-testid="contact-map-btn">
            <ExternalLink size={14} /> View on Map
          </a>
        </div>
      </div>
    </section>
  );
};

// "How To Order" was moved into BulkPricing.jsx (the side-by-side panel).
// We keep an empty wrapper here so existing imports keep working without errors.
export const HowToOrderSection = () => null;

export default ContactSection;
