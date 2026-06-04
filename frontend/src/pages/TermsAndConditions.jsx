import { Link } from "react-router-dom";
import useSEO from "@/hooks/useSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    id: "company-information",
    title: "1. Company Information",
    content: [
      "Amazing Groups is engaged in the business of customized corporate gifting, promotional merchandise, printing solutions, branding products, and related services.",
    ],
  },
  {
    id: "acceptance-of-terms",
    title: "2. Acceptance of Terms",
    content: [
      "By using our website, submitting an inquiry, requesting a quotation, or placing an order, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.",
    ],
  },
  {
    id: "products-services",
    title: "3. Products & Services",
    content: [
      "Amazing Groups offers customized and non-customized products. We reserve the right to modify, discontinue, or update any product or service without prior notice.",
    ],
  },
  {
    id: "quotations-pricing",
    title: "4. Quotations & Pricing",
    content: [
      "All quotations are valid for 2 or 3 days from the date of issue unless otherwise specified.",
      "Prices are subject to change without prior notice.",
      "Applicable taxes, shipping charges, and customization charges may be charged additionally.",
      "Bulk order pricing may vary depending on quantity and customization requirements.",
    ],
  },
  {
    id: "order-confirmation",
    title: "5. Order Confirmation",
    content: [
      "An order shall be considered confirmed only after:",
    ],
    list: [
      "Customer approval of quotation",
      "Approval of artwork/design (where applicable)",
      "Receipt of advance payment or full payment as agreed",
    ],
    footer: "Amazing Groups reserves the right to refuse or cancel any order at its discretion.",
  },
  {
    id: "artwork-customization-approval",
    title: "6. Artwork & Customization Approval",
    content: [
      "Customers are solely responsible for verifying:",
    ],
    list: [
      "Logos",
      "Spellings",
      "Design layouts",
      "Contact details",
      "Product specifications",
    ],
    footer: "Once artwork approval is received, Amazing Groups shall not be liable for any errors approved by the customer.",
  },
  {
    id: "payment-terms",
    title: "7. Payment Terms",
    list: [
      "Payment terms will be communicated at the time of order confirmation.",
      "Production may commence only after receipt of the agreed advance payment.",
      "Delayed payments may result in delayed deliveries.",
      "Outstanding dues may attract additional charges as permitted by law.",
    ],
  },
  {
    id: "delivery-shipping",
    title: "8. Delivery & Shipping",
    list: [
      "Delivery timelines are estimates only.",
      "Delays caused by logistics providers, natural disasters, government restrictions, strikes, or unforeseen events shall not create liability for Amazing Groups.",
      "Risk of loss transfers to the customer upon delivery to the shipping carrier.",
    ],
  },
  {
    id: "returns-replacements-refunds",
    title: "9. Returns, Replacements & Refunds",
    content: [
      "Customized Products:",
      "Customized products are non-returnable and non-refundable unless:",
    ],
    list: [
      "The product received is damaged.",
      "The product received is materially different from the approved artwork.",
    ],
    footer: [
      "Claims:",
      "Any claim regarding damaged or defective products must be reported within 48 hours of delivery along with photographs and relevant details.",
      "Amazing Groups reserves the right to inspect and verify all claims before approving replacement or refund requests.",
    ],
  },
  {
    id: "intellectual-property",
    title: "10. Intellectual Property",
    content: [
      "All content displayed on the website, including:",
    ],
    list: [
      "Logos",
      "Product Images",
      "Catalogues",
      "Graphics",
      "Videos",
      "Text Content",
      "Designs",
    ],
    footer: "are the exclusive property of Amazing Groups and may not be copied, reproduced, distributed, or used without prior written permission.",
  },
  {
    id: "website-usage",
    title: "11. Website Usage",
    content: [
      "Users agree not to:",
    ],
    list: [
      "Violate any applicable laws.",
      "Attempt unauthorized access to the website.",
      "Introduce viruses or malicious code.",
      "Use automated systems to extract website data.",
      "Upload misleading, unlawful, or offensive content.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "12. Limitation of Liability",
    content: [
      "Amazing Groups shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from:",
    ],
    list: [
      "Use of the website",
      "Delay in delivery",
      "Product misuse",
      "Third-party service failures",
    ],
    footer: "Our total liability shall not exceed the amount paid by the customer for the relevant order.",
  },
  {
    id: "privacy",
    title: "13. Privacy",
    list: [
      "Information submitted through the website may be collected and used for:",
      "Processing inquiries",
      "Order fulfillment",
      "Customer support",
      "Marketing communications",
    ],
    footer: "We do not sell customer information to third parties.",
  },
  {
    id: "force-majeure",
    title: "14. Force Majeure",
    content: [
      "Amazing Groups shall not be responsible for delays or failure in performance due to events beyond reasonable control, including:",
    ],
    list: [
      "Natural disasters",
      "Government actions",
      "Pandemics",
      "Labor disputes",
      "Transportation disruptions",
      "Internet or technology failures",
    ],
  },
  {
    id: "third-party-links",
    title: "15. Third-Party Links",
    content: [
      "Our website may contain links to third-party websites. Amazing Groups is not responsible for the content, security, or privacy practices of such websites.",
    ],
  },
  {
    id: "changes-to-terms",
    title: "16. Changes to Terms",
    content: [
      "Amazing Groups reserves the right to update these Terms & Conditions at any time. Updated terms will become effective immediately upon publication on the website.",
    ],
  },
  {
    id: "governing-law",
    title: "17. Governing Law & Jurisdiction",
    content: [
      "These Terms & Conditions shall be governed by the laws of India.",
      "Any disputes arising out of or relating to these Terms & Conditions shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.",
    ],
  },
  {
    id: "contact-us",
    title: "18. Contact Us",
    content: [
      "Amazing Groups",
      "📧 Email: info@amazinggroups.in",
      "📞 Phone: +91 XXXXX XXXXX",
      "🌐 Website: www.amazinggroups.in",
      "📍 Mumbai, Maharashtra, India",
      "By using our website and services, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.",
    ],
  },
];

const TermsAndConditions = () => {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useSEO({
    title: "Terms & Conditions",
    description: "Amazing Groups Terms & Conditions for website use, orders, payments, delivery, and liability.",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-white">
      <Navbar />

      <main className="py-10 px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto space-y-10">
          <section className="overflow-hidden rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8 md:p-10 shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col gap-3 text-sm text-white/50 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <Link to="/" className="hover:text-amber-brand transition-colors">Home</Link>
                <span>›</span>
                <span className="text-white">Terms & Conditions</span>
              </div>
              <div className="text-xs uppercase tracking-[0.35em] text-amber-brand font-semibold">Terms & Conditions</div>
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div className="space-y-6">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.02]">TERMS & CONDITIONS</h1>
                <p className="max-w-3xl text-base text-gray-300 leading-relaxed sm:text-lg">
                  Welcome to Amazing Groups. These Terms & Conditions govern your use of our website, products, and services. By accessing our website or placing an order with us, you agree to be bound by these Terms & Conditions.
                </p>
                <p className="rounded-3xl border border-[#d4af37]/15 bg-[#0b0b10] px-5 py-4 text-sm text-white/80">
                  Last Updated: <span className="text-white">{lastUpdated}</span>
                </p>
              </div>
              <div className="rounded-[2rem] border border-[#d4af37]/15 bg-[#0b0b10] p-6 shadow-[0_25px_80px_-40px_rgba(212,175,55,0.35)]">
                <div className="text-xs uppercase tracking-[0.35em] text-amber-brand font-semibold mb-3">Need Help?</div>
                <p className="text-sm text-white/80 leading-relaxed">
                  For questions about these terms, contact us at <a href="mailto:info@amazinggroups.in" className="text-amber-brand hover:text-white transition-colors">info@amazinggroups.in</a>.
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)] lg:sticky lg:top-28">
              <div className="text-xs uppercase tracking-[0.35em] text-amber-brand font-semibold mb-5">Contents</div>
              <nav className="space-y-3 text-sm text-white/80">
                {sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`} className="block rounded-2xl border border-transparent px-3 py-2 transition-colors hover:border-amber-brand/30 hover:bg-[#0f0f15] hover:text-amber-brand">
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>

            <article className="space-y-6">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]">
                  <h2 className="font-display text-2xl text-white leading-tight mb-4">{section.title}</h2>
                  {section.content && section.content.map((paragraph, index) => (
                    <p key={index} className="text-sm text-white/80 leading-relaxed mb-3">
                      {paragraph}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="space-y-3 text-sm text-white/80 list-disc list-inside leading-relaxed mb-3">
                      {section.list.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.footer && (
                    Array.isArray(section.footer) ? (
                      section.footer.map((item, index) => (
                        <p key={index} className="text-sm text-white/80 leading-relaxed mb-3">
                          {item}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-white/80 leading-relaxed">
                        {section.footer}
                      </p>
                    )
                  )}
                </section>
              ))}
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
