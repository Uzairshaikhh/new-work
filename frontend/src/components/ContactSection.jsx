import { Phone, Mail, MapPin, ExternalLink, Info } from "lucide-react";
import SectionHeading from "./SectionHeading";

const ContactSection = () => {
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=Jogeshwari+West+Mumbai";

  const items = [
    { icon: Phone, label: "Call us", value: "+91 8657 211 339", href: "tel:+918657211339", testid: "contact-phone" },
    { icon: Mail, label: "Email us", value: "amazinggroups51@gmail.com", href: "mailto:amazinggroups51@gmail.com", testid: "contact-email" },
    { icon: MapPin, label: "Visit us", value: "Jogeshwari West, Mumbai", href: mapUrl, testid: "contact-location" },
  ];

  return (
    <section id="contact" className="py-20 md:py-28 px-6 lg:px-10 bg-amber-cream" data-testid="contact-section">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Let's start the conversation"
          subtitle="Tell us about your gifting needs. Our team responds within hours during business days."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <a
                key={it.label}
                href={it.href}
                target={it.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                data-testid={it.testid}
                className="group bg-white rounded-2xl p-7 card-shadow card-shadow-hover border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-soft text-amber-brand flex items-center justify-center mb-5">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">{it.label}</div>
                <div className="font-display text-lg text-navy group-hover:text-amber-brand transition-colors break-words">
                  {it.value}
                </div>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" data-testid="contact-map-btn">
            <ExternalLink size={16} /> View on Map
          </a>
        </div>
      </div>
    </section>
  );
};

// "How to Order" section split out for clarity
export const HowToOrderSection = () => {
  const steps = [
    { n: "01", title: "Choose Product", body: "Browse our catalogue and pick the items you love." },
    { n: "02", title: "Share Requirements", body: "Send us your logo, design and quantity via WhatsApp or call." },
    { n: "03", title: "Get Quote & Mockup", body: "Our team reverts with a quote and a visual mockup for approval." },
    { n: "04", title: "Confirm & Delivery", body: "Approve, we craft your order, and ship pan-India." },
  ];

  return (
    <section id="how-to-order" className="py-20 md:py-28 px-6 lg:px-10 bg-white" data-testid="how-to-order-section">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeading
          eyebrow="How To Order"
          title="A simple 4-step process"
          subtitle="From your first message to delivery — straightforward and personally handled."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div key={s.n} className="bg-cream rounded-2xl p-7 border border-amber-soft/60 hover:border-amber-brand/60 transition-colors" data-testid={`order-step-${s.n}`}>
              <div className="w-14 h-14 rounded-xl bg-amber-brand text-white flex items-center justify-center font-display text-xl mb-5 shadow-md shadow-amber-brand/30">
                {s.n}
              </div>
              <h3 className="font-display text-lg text-navy mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto p-7 rounded-2xl bg-navy text-white flex items-start gap-4" data-testid="order-policy">
          <Info size={22} className="text-amber-brand flex-shrink-0 mt-1" />
          <p className="text-sm md:text-base leading-relaxed text-white/85">
            <span className="font-semibold text-white">A note on customisation:</span> every piece is handcrafted to your specifications.{" "}
            <span className="text-amber-brand font-semibold">Once an order is placed it cannot be cancelled.</span>{" "}
            Please confirm all design, personalisation and quantity details with our team before committing.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
