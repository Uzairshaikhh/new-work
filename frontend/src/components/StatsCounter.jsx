import { useEffect, useRef, useState } from "react";
import { Users, Calendar, Package, MapPin } from "lucide-react";

const useCounter = (target, duration = 1600) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.35 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setCount(target);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target, duration]);

  return { count, ref };
};

const StatItem = ({ icon: Icon, value, label, delay = 0 }) => {
  const num = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");
  const { count, ref } = useCounter(num);

  return (
    <div
      ref={ref}
      className="reveal text-center px-4"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Icon ring */}
      <div className="relative w-14 h-14 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full bg-[#d4af37]/8 border border-[#d4af37]/20 animate-glow-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon size={20} className="text-[#d4af37]" />
        </div>
      </div>

      {/* Number */}
      <div className="font-display text-4xl lg:text-5xl text-gradient-gold mb-1 tabular-nums">
        {count}{suffix}
      </div>

      {/* Label */}
      <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold mt-2">
        {label}
      </div>
    </div>
  );
};

const StatsCounter = ({ settings }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const items = el.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Users,    value: settings?.stats_clients  || "500+",  label: "Happy Clients" },
    { icon: Calendar, value: settings?.stats_years    || "10+",   label: "Years Experience" },
    { icon: Package,  value: settings?.stats_products || "1000+", label: "Products Delivered" },
    { icon: MapPin,   value: settings?.stats_cities   || "50+",   label: "Cities Covered" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 px-6 lg:px-10 overflow-hidden section-glow-top"
      style={{ background: "linear-gradient(180deg, #0e0e13 0%, #0a0a0d 100%)" }}
    >
      {/* Subtle ambient orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] opacity-[0.035] blur-3xl rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #d4af37 0%, transparent 70%)" }}
      />

      <div className="relative max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#d4af37]/8">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
