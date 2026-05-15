import { Quote } from "lucide-react";
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
    body: "The customisation and packaging were perfect. Highly recommended for any team!",
  },
  {
    name: "Amit Verma",
    role: "Procurement Head, BuildMax",
    avatar: "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=srgb&fm=jpg&w=120&q=80",
    body: "Great products at the best prices for bulk orders. Very satisfied with the experience.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 md:py-24 px-6 lg:px-10 bg-[#14141a]" data-testid="testimonials-section">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeading eyebrow="Client Stories" title="What our clients say" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="bg-[#15151a] rounded-2xl p-7 card-shadow border border-[#d4af37]/15"
              data-testid={`testimonial-${r.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <Quote size={28} className="text-amber-brand mb-4" />
              <p className="text-gray-200 leading-relaxed text-[15px] mb-6">
                "{r.body}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#d4af37]/15">
                <img src={r.avatar} alt={r.name} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-white">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.role}</div>
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
