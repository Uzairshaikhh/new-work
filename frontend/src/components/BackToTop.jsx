import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-24 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-[#15151a] border border-[#d4af37]/30 text-amber-brand shadow-lg hover:bg-amber-brand hover:text-[#0a0a0d] transition-all duration-200"
    >
      <ChevronUp size={18} />
    </button>
  );
};

export default BackToTop;
