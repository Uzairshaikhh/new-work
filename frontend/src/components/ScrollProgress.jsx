import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setPct(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (pct <= 0) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[200] h-[2px] bg-gradient-to-r from-[#b8912a] via-[#d4af37] to-[#f0d060] transition-none"
      style={{ width: `${pct}%` }}
      aria-hidden="true"
    />
  );
};

export default ScrollProgress;
