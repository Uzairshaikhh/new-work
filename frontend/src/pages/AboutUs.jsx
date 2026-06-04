import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, Briefcase, Globe2, Gift, Key, PenTool, Sparkles, ShieldCheck, ShoppingBag, Tag, Truck, UserCheck, Wallet } from "lucide-react";
import useSEO from "@/hooks/useSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import { waLink } from "@/lib/brand";

const features = [
  { icon: ShieldCheck, title: "Quality First", description: "Premium materials and advanced customization techniques ensure the highest standards." },
  { icon: Tag, title: "Customized Solutions", description: "Personalized gifting and branding solutions tailored to your unique requirements." },
  { icon: Wallet, title: "Competitive Pricing", description: "Cost-effective solutions without compromising on quality for all business sizes." },
  { icon: Truck, title: "Reliable Service", description: "Smooth, timely execution and professional support from concept to delivery." },
  { icon: Globe2, title: "Nationwide Reach", description: "Serving businesses across India, including startups, corporates, and institutions." },
];

const productItems = [
  { icon: Gift, label: "Corporate Gifts" },
  { icon: Wallet, label: "Premium Wallets" },
  { icon: BookOpen, label: "Office Diaries & Notebooks" },
  { icon: Tag, label: "Tea Coasters" },
  { icon: ShoppingBag, label: "Water Bottles & Drinkware" },
  { icon: PenTool, label: "Pens & Stationery" },
  { icon: Key, label: "Keychains & Accessories" },
  { icon: Briefcase, label: "Luggage Tags" },
  { icon: Globe2, label: "USB Drives & Tech Accessories" },
  { icon: UserCheck, label: "Customized Apparel" },
  { icon: Sparkles, label: "Promotional Merchandise" },
  { icon: Truck, label: "Event & Conference Giveaways" },
  { icon: ShieldCheck, label: "Printing & Branding Solutions" },
  { icon: Award, label: "And Much More" },
];

const stats = [
  { label: "Customized Products", value: 1280 },
  { label: "Corporate Clients", value: 320 },
  { label: "Cities Served", value: 48 },
  { label: "Happy Customers", value: 720 },
];

const useAnimatedCounters = (targets) => {
  const [counts, setCounts] = useState(targets.map(() => 0));

  useEffect(() => {
    const duration = 1200;
    const stepTime = 40;
    const steps = Math.ceil(duration / stepTime);
    const increments = targets.map((val) => val / steps);

    const interval = setInterval(() => {
      setCounts((prev) => {
        let finished = true;
        const next = prev.map((value, index) => {
          const target = targets[index];
          const nextValue = Math.min(target, value + increments[index]);
          if (nextValue < target) finished = false;
          return nextValue;
        });
        if (finished) {
          clearInterval(interval);
          return targets;
        }
        return next;
      });
    }, stepTime);

    return () => clearInterval(interval);
  }, [targets]);

  return counts.map((value, index) => Math.round(value));
};

const AboutUs = () => {
  const counts = useAnimatedCounters(stats.map((item) => item.value));

  useSEO({
    title: "About Us",
    description: "About Amazing Groups — premium corporate gifting, branding solutions, and customized merchandise for businesses across India.",
  });

  const servicesGrid = useMemo(
    () => (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-[1.75rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)] transition-all hover:border-amber-brand/40 hover:bg-[#1b1b23]">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#0f0f15] text-amber-brand shadow-sm shadow-[#d4af37]/10 mb-4">
                <Icon size={20} />
              </div>
              <div className="font-semibold text-white">{item.label}</div>
            </div>
          );
        })}
      </div>
    ), []);

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-white">
      <Navbar />

      <main className="py-10 px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto space-y-10">
          <section className="overflow-hidden rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8 md:p-10 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col gap-4 text-sm text-white/50 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Link to="/" className="hover:text-amber-brand transition-colors">Home</Link>
                <span>›</span>
                <span className="text-white">About Us</span>
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold">About Us</div>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div className="space-y-6">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.02]">
                  Welcome to Amazing Groups
                </h1>
                <p className="max-w-3xl text-base text-gray-300 leading-relaxed sm:text-lg">
                  At Amazing Groups, we believe that every gift tells a story and every brand deserves to be remembered. We are a leading provider of customized corporate gifting, promotional merchandise, branding solutions, and printing services, helping businesses create lasting impressions through high-quality personalized products.
                </p>
                <p className="max-w-3xl text-base text-gray-300 leading-relaxed sm:text-lg">
                  With a passion for creativity and attention to detail, we transform everyday products into powerful branding tools. Whether you're looking for employee appreciation gifts, client giveaways, event merchandise, or customized promotional products, we deliver solutions that reflect your brand identity and values.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href={waLink("Hi Amazing Groups, I'd like a quote for corporate gifting.")} target="_blank" rel="noopener noreferrer" className="btn-primary !py-3 !px-6 !text-sm">
                    Get a Quote
                  </a>
                  <a href={`mailto:info@amazinggroups.in`} className="btn-amber !py-3 !px-6 !text-sm">
                    Contact Us
                  </a>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#d4af37]/15 bg-[#0b0b10] p-6 shadow-[0_25px_80px_-40px_rgba(212,175,55,0.35)]">
                <div className="mb-3 text-xs uppercase tracking-[0.35em] text-amber-brand font-semibold">Brand Story</div>
                <div className="space-y-4 text-sm text-white/80 leading-relaxed">
                  <p>We create premium corporate gifting experiences with memorable, brand-led products.</p>
                  <p>Every project is treated as a collaboration — from ideation to delivery.</p>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {stats.map((item, index) => (
                    <div key={item.label} className="rounded-3xl border border-[#d4af37]/10 bg-[#15151a] p-4 text-center">
                      <div className="text-3xl font-display text-white">{counts[index]}</div>
                      <div className="text-xs uppercase tracking-[0.35em] text-gray-400 mt-2">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8 md:p-10">
            <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <SectionHeading title="What We Do" align="left" />
              <div className="rounded-3xl border border-[#d4af37]/15 bg-[#0f0f15] px-5 py-3 text-sm text-white/70">
                Modern solutions for premium gifting and branding across India.
              </div>
            </div>

            {servicesGrid}
          </section>

          <section className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-brand font-semibold">Why Choose Amazing Groups?</p>
                <div className="rounded-[1.75rem] bg-[#0f0f15] p-6 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.6)]">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {features.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <div key={feature.title} className="rounded-3xl border border-[#d4af37]/10 bg-[#15151a] p-5 transition-all hover:border-amber-brand/40">
                          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-[#0b0b13] text-amber-brand mb-4">
                            <Icon size={18} />
                          </div>
                          <h3 className="font-semibold text-white">{feature.title}</h3>
                          <p className="mt-2 text-sm text-white/70 leading-relaxed">{feature.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#d4af37]/15 bg-[#0f0f15] p-8 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.6)]">
                <div className="text-xs uppercase tracking-[0.35em] text-amber-brand font-semibold mb-3">Mission & Vision</div>
                <div className="space-y-6 text-sm text-white/80">
                  <div>
                    <h3 className="font-semibold text-white mb-2">Our Mission</h3>
                    <p>To help businesses strengthen relationships, enhance brand visibility, and create memorable experiences through innovative and high-quality customized products.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Our Vision</h3>
                    <p>To become India's most trusted and preferred corporate gifting and branding partner by delivering excellence, creativity, and value in every project.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8 md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.35em] text-amber-brand font-semibold mb-3">Let’s Create Something Memorable</p>
                <h2 className="font-display text-3xl text-white leading-tight">Amazing Groups – Your Trusted Partner for Corporate Gifting & Branding Solutions.</h2>
                <p className="mt-4 text-sm text-white/80 leading-relaxed">
                  Whether you need a single customized product or a large-scale corporate gifting solution, Amazing Groups is committed to bringing your ideas to life with professionalism, creativity, and exceptional service.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={waLink("Hi Amazing Groups, I'd like a quote for corporate gifting.")} target="_blank" rel="noopener noreferrer" className="btn-primary !py-3 !px-6 !text-sm">
                  Get a Quote
                </a>
                <a href={`mailto:info@amazinggroups.in`} className="btn-amber !py-3 !px-6 !text-sm">
                  Contact Us
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
