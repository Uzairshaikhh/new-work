import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";

const REVIEWS = [
  {
    name: "Rahul Mehta",
    role: "Marketing Head, TechCorp",
    avatar: "https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=srgb&fm=jpg&w=120&q=80",
    body: "Excellent quality and on-time delivery. Our go-to partner for corporate gifting!",
  },
  {
    name: "Priya Sharma",
    role: "HR Manager, Business Mart",
    avatar: "https://images.unsplash.com/photo-1770058428154-9eee8a6a1fbb?crop=entropy&cs=srgb&fm=jpg&w=120&q=80",
    body: "The customization and packaging were perfect. Highly recommended!",
  },
  {
    name: "Amit Verma",
    role: "Procurement Head, BuildMax",
    avatar: "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=srgb&fm=jpg&w=120&q=80",
    body: "Great products at the best prices for bulk orders. Very satisfied!",
  },
];

const Testimonials = () => {
  return (
    <section className="py-10 px-6 lg:px-10" data-testid="testimonials-section">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeading eyebrow="Reviews" title="What Our Clients Say" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVIEWS.map((r) => (
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
                <img src={r.avatar} alt={r.name} className="w-8 h-8 rounded-full object-cover" />
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
