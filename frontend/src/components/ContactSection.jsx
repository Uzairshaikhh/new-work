import { Phone, Mail, MapPin, ExternalLink, Info } from "lucide-react";
import SectionHeading from "./SectionHeading";

const ContactSection = () => {
  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=Jogeshwari+West+Mumbai";

  const items = [
    {
      icon: Phone,
      eyebrow: "Telephone",
      value: "+91 8657 211 339",
      href: "tel:+918657211339",
      testid: "contact-phone",
    },
    {
      icon: Mail,
      eyebrow: "Correspondence",
      value: "amazinggroups51@gmail.com",
      href: "mailto:amazinggroups51@gmail.com",
      testid: "contact-email",
    },
    {
      icon: MapPin,
      eyebrow: "Atelier",
      value: "Jogeshwari West, Mumbai",
      href: mapUrl,
      testid: "contact-location",
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-28 md:py-36 px-6 lg:px-10 border-t border-[#D4AF37]/15"
      data-testid="contact-section"
    >
      <div className="max-w-[1400px] mx-auto">
        <SectionHeading
          eyebrow="Get In Touch"
          title="The conversation begins here"
          subtitle="Tell us about the moment you are crafting. Our atelier in Mumbai responds within hours."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <a
                key={it.eyebrow}
                href={it.href}
                target={it.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                data-testid={it.testid}
                className="group block p-10 bg-[#0e0e0e] border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 hover:gold-glow transition-all duration-500"
              >
                <Icon size={22} strokeWidth={1.3} className="text-[#D4AF37] mb-6" />
                <div className="eyebrow mb-3">{it.eyebrow}</div>
                <div className="font-display text-xl text-white group-hover:text-[#D4AF37] transition-colors break-words">
                  {it.value}
                </div>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            data-testid="contact-map-btn"
          >
            <ExternalLink size={14} strokeWidth={1.8} />
            View on Map
          </a>
        </div>

        {/* Ordering Process */}
        <div className="mt-24 pt-20 border-t border-[#D4AF37]/15" data-testid="ordering-process">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <div className="eyebrow mb-5">How To Order</div>
            <h3 className="font-display text-3xl md:text-5xl text-white leading-[1.1] mb-6">
              A bespoke process, simplified
            </h3>
            <div className="divider-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {[
              {
                step: "01",
                title: "Choose Your Piece",
                body: "Browse our collections and find the product you love. Tap Call or WhatsApp on any product page.",
              },
              {
                step: "02",
                title: "Talk To Our Atelier",
                body: "Our team will chat with you to understand your desired design, personalisation, quantity and occasion.",
              },
              {
                step: "03",
                title: "We Craft & Deliver",
                body: "Once confirmed, your bespoke piece is handcrafted to your specifications and delivered with care.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-10 bg-[#0e0e0e] border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-all duration-500"
                data-testid={`order-step-${s.step}`}
              >
                <div className="font-display text-5xl gold-text mb-4">{s.step}</div>
                <div className="eyebrow mb-3">{s.title}</div>
                <p className="text-sm text-neutral-400 font-light leading-relaxed mt-3">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div
            className="max-w-3xl mx-auto p-8 md:p-10 border border-[#D4AF37]/30 bg-[#D4AF37]/[0.04] flex items-start gap-5"
            data-testid="order-policy"
          >
            <Info size={22} strokeWidth={1.3} className="text-[#D4AF37] flex-shrink-0 mt-1" />
            <div>
              <div className="eyebrow mb-2 text-[#D4AF37]">A Note On Customisation</div>
              <p className="text-sm md:text-base text-neutral-300 font-light leading-relaxed">
                Every piece is handcrafted to your specifications, so{" "}
                <span className="text-white">once an order is placed it cannot be cancelled</span>.
                Please confirm all design, personalisation and quantity details with our team before
                committing to production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
