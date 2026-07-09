import { useEffect, useRef, useState } from "react";
import { Users, Calendar, Package, MapPin } from "lucide-react";

const useCounter = (target, duration = 1400) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.4 }
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
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target, duration]);

  return { count, ref };
};

const StatItem = ({ icon: Icon, value, label }) => {
  const num = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");
  const { count, ref } = useCounter(num);

  return (
    <div ref={ref} className="text-center">
      <div className="w-14 h-14 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center mx-auto mb-4">
        <Icon size={22} className="text-amber-brand" />
      </div>
      <div className="font-display text-4xl lg:text-5xl text-white mb-1">
        {count}{suffix}
      </div>
      <div className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">{label}</div>
    </div>
  );
};

const StatsCounter = ({ settings }) => {
  const stats = [
    { icon: Users,   value: settings?.stats_clients  || "500+",  label: "Happy Clients" },
    { icon: Calendar,value: settings?.stats_years    || "10+",   label: "Years Experience" },
    { icon: Package, value: settings?.stats_products || "1000+", label: "Products Delivered" },
    { icon: MapPin,  value: settings?.stats_cities   || "50+",   label: "Cities Covered" },
  ];

  return (
    <section className="py-14 px-6 lg:px-10 border-y border-[#d4af37]/10 bg-[#0e0e13]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((s) => <StatItem key={s.label} {...s} />)}
      </div>
    </section>
  );
};

export default StatsCounter;
