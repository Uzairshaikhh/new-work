import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Phone, CheckCircle, Users, Award, Truck, Clock, Package, Star, Gift, Building2, Briefcase, PartyPopper, HeartHandshake } from "lucide-react";
import { api } from "../lib/api";
import { BRAND, waLink } from "../lib/brand";
import useSEO from "../hooks/useSEO";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryGrid from "../components/CategoryGrid";

const SERVICES = [
  { icon: Users,        title: "Employee Welcome Kits",      desc: "Make every new joiner feel special with branded onboarding kits tailored to your company culture." },
  { icon: Briefcase,    title: "Corporate Gift Hampers",      desc: "Premium hampers for clients, partners, and executives — curated for maximum brand impact." },
  { icon: PartyPopper,  title: "Event & Conference Merch",    desc: "Branded merchandise for product launches, trade shows, and corporate events." },
  { icon: Gift,         title: "Festive & Seasonal Gifting",  desc: "Diwali, Christmas, New Year — bulk seasonal gifting that every recipient will remember." },
  { icon: Building2,    title: "Promotional Products",        desc: "Logo-branded everyday items that keep your brand visible long after the gift is given." },
  { icon: HeartHandshake, title: "Client Appreciation Gifts", desc: "Thoughtful premium gifts that strengthen business relationships and drive loyalty." },
];

const WHY = [
  { icon: Award,    title: "Premium Quality",     desc: "Every product meets our strict quality standards before it reaches your doorstep." },
  { icon: Truck,    title: "Pan-India Delivery",  desc: "Reliable on-time delivery across all major cities and towns in India." },
  { icon: Clock,    title: "Fast Turnaround",     desc: "Most orders dispatched within 3–7 days. Rush orders accommodated on request." },
  { icon: Star,     title: "Custom Branding",     desc: "Logo printing, embossing, engraving, and custom packaging — all in-house." },
  { icon: Package,  title: "Bulk Pricing",        desc: "Competitive pricing for bulk orders with transparent volume discounts." },
  { icon: CheckCircle, title: "GST Billing",      desc: "Proper GST invoicing for seamless business accounting and compliance." },
];

const PROCESS = [
  { step: "01", title: "Share Your Brief",     desc: "Tell us your budget, quantity, occasion, and branding requirements via WhatsApp or email." },
  { step: "02", title: "Get Free Samples",     desc: "We send curated product recommendations with pricing and free samples on request." },
  { step: "03", title: "Design & Approve",     desc: "Our design team creates mockups with your logo. You approve before production begins." },
  { step: "04", title: "Delivery Everywhere",  desc: "Your branded gifts are packed and delivered pan-India, on time, every time." },
];

const Corporate = () => {
  const [categories, setCategories] = useState([]);
  const waHref = waLink("Hi Amazing Groups, I'd like to discuss corporate gifting for my organisation. Could you help?");

  useSEO({
    title: "Corporate Gifting Solutions — Amazing Groups",
    description: "Premium B2B corporate gifting solutions — employee kits, event merchandise, festive gifts, and custom branded products. Pan-India delivery.",
  });

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0d]">
      <Navbar />

      {/* Hero */}
      <section className="hero-gradient border-b border-[#d4af37]/15 py-16 md:py-24 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto text-center">
          <div className="pill-badge mx-auto mb-6 inline-flex">
            <Building2 size={12} /> Corporate Gifting Solutions
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6 max-w-4xl mx-auto">
            Premium Gifts That Make Your <span className="text-amber-brand">Brand Unforgettable</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            From 100 to 100,000 pieces — we deliver premium branded corporate gifts across India. Trusted by 500+ businesses for employee kits, client gifts, and event merchandise.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-primary !py-3 !px-8">
              <MessageCircle size={16} /> Get a Free Quote
            </a>
            <a href={`tel:${BRAND.phoneTel}`} className="btn-amber !py-3 !px-8">
              <Phone size={16} /> Call Us Now
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">What We Offer</div>
            <h2 className="font-display text-3xl md:text-4xl text-white">Corporate Gifting Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-[#15151a] border border-[#d4af37]/15 rounded-xl p-6 hover:border-[#d4af37]/40 transition-all group">
                  <div className="w-11 h-11 rounded-lg bg-[#d4af37]/10 flex items-center justify-center mb-4 group-hover:bg-[#d4af37]/20 transition-colors">
                    <Icon size={20} className="text-amber-brand" />
                  </div>
                  <h3 className="font-display text-lg text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 px-6 lg:px-10 bg-[#0e0e13] border-y border-[#d4af37]/10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">Why Choose Us</div>
            <h2 className="font-display text-3xl md:text-4xl text-white">The Amazing Groups Difference</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center mt-0.5">
                    <Icon size={18} className="text-amber-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{w.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">Our Process</div>
            <h2 className="font-display text-3xl md:text-4xl text-white">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {PROCESS.map((p, i) => (
              <div key={p.step} className="relative text-center">
                <div className="font-display text-5xl text-[#d4af37]/15 mb-4">{p.step}</div>
                <h3 className="font-display text-lg text-white mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
                {i < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[60%] w-[80%] h-px border-t border-dashed border-[#d4af37]/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 px-6 lg:px-10 bg-[#0e0e13] border-t border-[#d4af37]/10">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-10">
              <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">Browse</div>
              <h2 className="font-display text-3xl text-white">Popular Gift Categories</h2>
            </div>
            <CategoryGrid categories={categories} loading={false} />
            <div className="text-center mt-8">
              <Link to="/products" className="btn-amber !py-2.5 !px-8 !text-sm inline-flex">
                View All Products →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-[900px] mx-auto bg-gradient-to-br from-[#15151a] via-[#1a1a22] to-[#15151a] border border-[#d4af37]/30 rounded-2xl p-8 md:p-12 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-4">Ready to Start?</div>
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Let's Create Something Memorable</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            Share your brief and get a personalised quote within 2 hours. No commitments, no minimums on samples.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-primary !py-3 !px-8">
              <MessageCircle size={16} /> WhatsApp for Quote
            </a>
            <a href={`tel:${BRAND.phoneTel}`} className="btn-amber !py-3 !px-8">
              <Phone size={16} /> {BRAND.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Corporate;
