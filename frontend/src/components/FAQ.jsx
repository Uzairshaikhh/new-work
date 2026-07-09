import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { api } from "../lib/api";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api.get("/faqs").then((r) => setFaqs(r.data)).catch(() => {});
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="py-14 px-6 lg:px-10" id="faq">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">FAQ</div>
          <h2 className="font-display text-2xl md:text-3xl text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={faq.id || i}
              className="border border-[#d4af37]/15 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-white hover:text-amber-brand transition-colors bg-[#15151a] hover:bg-[#1a1a22]"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={16}
                  className={`flex-shrink-0 ml-3 text-amber-brand transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-5 py-4 text-sm text-gray-300 leading-relaxed bg-[#0e0e13] border-t border-[#d4af37]/10">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
