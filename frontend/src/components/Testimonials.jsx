import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";

const Testimonials = ({ settings }) => {
  const reviews = settings?.testimonials || [];

  return (
    <section className="py-10 px-6 lg:px-10" data-testid="testimonials-section">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeading eyebrow="Reviews" title="What Our Clients Say" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-[#15151a] rounded-lg p-5 border border-[#d4af37]/15"
              data-testid={`testimonial-${r.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="flex gap-0.5 mb-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={12} className="fill-amber-brand text-amber-brand" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{r.body}"</p>
              <div className="flex items-center gap-2.5 pt-3 border-t border-[#d4af37]/10">
                <img
  src={r.avatar}
  alt={r.name}
  loading="lazy"
  decoding="async"
  width="32"
  height="32"
  className="w-8 h-8 rounded-full object-cover"
/>
                <div>
                  <div className="text-xs font-semibold text-white">– {r.name}</div>
                  <div className="text-[10px] text-gray-400">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
