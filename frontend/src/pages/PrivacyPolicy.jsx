import { Link } from "react-router-dom";
import useSEO from "@/hooks/useSEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";

const PrivacyPolicy = () => {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useSEO({
    title: "Privacy Policy",
    description:
      "Amazing Groups Privacy Policy page explaining how we collect, use, store, and protect your information.",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0d] text-white" data-testid="privacy-policy-page">
      <Navbar />

      <main className="py-10 px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto space-y-10">
          <div className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8 md:p-10 shadow-[0_25px_80px_-30px_rgba(0,0,0,0.75)]">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-amber-brand font-semibold mb-2">Privacy Policy</div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                  Privacy Policy
                </h1>
                <p className="text-sm text-gray-400 mt-4 max-w-2xl">
                  At Amazing Groups, we value your privacy and are committed to protecting your personal information.
                </p>
              </div>
              <div className="rounded-3xl border border-[#d4af37]/15 bg-[#0f0f15] px-4 py-3 text-sm text-gray-300">
                Last Updated: <span className="text-white">{lastUpdated}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
              <Link to="/" className="hover:text-amber-brand transition-colors">Home</Link>
              <span>›</span>
              <span className="text-white">Privacy Policy</span>
            </div>
          </div>

          <div className="grid gap-6 items-start lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-6 text-sm text-white/80 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)]">
              <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-5">Contents</div>
              <nav className="space-y-3">
                <a href="#information-we-collect" className="block hover:text-amber-brand transition-colors">1. Information We Collect</a>
                <a href="#how-we-use" className="block hover:text-amber-brand transition-colors">2. How We Use Your Information</a>
                <a href="#information-sharing" className="block hover:text-amber-brand transition-colors">3. Information Sharing</a>
                <a href="#data-security" className="block hover:text-amber-brand transition-colors">4. Data Security</a>
                <a href="#cookies-and-tracking" className="block hover:text-amber-brand transition-colors">5. Cookies and Tracking Technologies</a>
                <a href="#marketing-communications" className="block hover:text-amber-brand transition-colors">6. Marketing Communications</a>
                <a href="#customer-artwork" className="block hover:text-amber-brand transition-colors">7. Customer Artwork & Branding Materials</a>
                <a href="#data-retention" className="block hover:text-amber-brand transition-colors">8. Data Retention</a>
                <a href="#third-party-websites" className="block hover:text-amber-brand transition-colors">9. Third-Party Websites</a>
                <a href="#your-rights" className="block hover:text-amber-brand transition-colors">10. Your Rights</a>
                <a href="#childrens-privacy" className="block hover:text-amber-brand transition-colors">11. Children's Privacy</a>
                <a href="#changes-policy" className="block hover:text-amber-brand transition-colors">12. Changes to This Privacy Policy</a>
                <a href="#contact-us" className="block hover:text-amber-brand transition-colors">13. Contact Us</a>
              </nav>
            </aside>

            <article className="space-y-6">
              <SectionHeading title="Privacy Policy" align="left" />

              <section id="information-we-collect" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
                  <div>
                    <h2 className="font-display text-2xl text-white leading-tight">1. Information We Collect</h2>
                    <p className="text-sm text-gray-400 mt-3 max-w-2xl">
                      We collect several types of information to serve your business needs and improve your experience.
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                  <div className="rounded-3xl border border-[#d4af37]/15 bg-[#0f0f15] p-5">
                    <h3 className="text-sm uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">Personal Information</h3>
                    <ul className="space-y-2 text-sm text-white/80 list-disc list-inside leading-relaxed">
                      <li>Full Name</li>
                      <li>Company Name</li>
                      <li>Email Address</li>
                      <li>Phone Number</li>
                      <li>Billing Address</li>
                      <li>Shipping Address</li>
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-[#d4af37]/15 bg-[#0f0f15] p-5">
                    <h3 className="text-sm uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">Business Information</h3>
                    <ul className="space-y-2 text-sm text-white/80 list-disc list-inside leading-relaxed">
                      <li>GST Number (if applicable)</li>
                      <li>Company Details</li>
                      <li>Branding and Artwork Files</li>
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-[#d4af37]/15 bg-[#0f0f15] p-5">
                    <h3 className="text-sm uppercase tracking-[0.3em] text-amber-brand font-semibold mb-3">Website Usage Information</h3>
                    <ul className="space-y-2 text-sm text-white/80 list-disc list-inside leading-relaxed">
                      <li>IP Address</li>
                      <li>Browser Type</li>
                      <li>Device Information</li>
                      <li>Pages Visited</li>
                      <li>Website Activity Data</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="how-we-use" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">2. How We Use Your Information</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  We use your information to:
                </p>
                <ul className="mt-4 space-y-3 text-sm text-white/80 list-disc list-inside leading-relaxed">
                  <li>Respond to inquiries and quotation requests</li>
                  <li>Process and fulfill orders</li>
                  <li>Provide customer support</li>
                  <li>Customize products and services</li>
                  <li>Send order updates and delivery notifications</li>
                  <li>Improve our website and user experience</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Send promotional offers and business updates (where permitted)</li>
                </ul>
              </section>

              <section id="information-sharing" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">3. Information Sharing</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Amazing Groups does not sell, rent, or trade your personal information.
                </p>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  We may share information with:
                </p>
                <ul className="mt-4 space-y-3 text-sm text-white/80 list-disc list-inside leading-relaxed">
                  <li>Delivery and logistics partners</li>
                  <li>Payment processing providers</li>
                  <li>Printing and production partners (when required for order fulfillment)</li>
                  <li>Government authorities when required by law</li>
                </ul>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  All third parties are expected to maintain the confidentiality of customer information.
                </p>
              </section>

              <section id="data-security" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">4. Data Security</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  We implement reasonable security measures to protect your personal information from unauthorized access, misuse, disclosure, or loss.
                </p>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  However, no method of internet transmission or electronic storage is completely secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section id="cookies-and-tracking" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">5. Cookies and Tracking Technologies</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Our website may use cookies and similar technologies to:
                </p>
                <ul className="mt-4 space-y-3 text-sm text-white/80 list-disc list-inside leading-relaxed">
                  <li>Improve website performance</li>
                  <li>Remember user preferences</li>
                  <li>Analyze website traffic</li>
                  <li>Enhance browsing experience</li>
                </ul>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  You may choose to disable cookies through your browser settings; however, certain website features may not function properly.
                </p>
              </section>

              <section id="marketing-communications" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">6. Marketing Communications</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  We may send promotional emails, product updates, special offers, and company announcements.
                </p>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  You may opt out of marketing communications at any time by contacting us or using the unsubscribe option provided in the communication.
                </p>
              </section>

              <section id="customer-artwork" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">7. Customer Artwork & Branding Materials</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Any logos, artwork, designs, trademarks, or branding materials provided by customers are used solely for order fulfillment and customization purposes.
                </p>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  Customers confirm that they have the necessary rights and permissions to use such materials.
                </p>
              </section>

              <section id="data-retention" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">8. Data Retention</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  We retain customer information only for as long as necessary to:
                </p>
                <ul className="mt-4 space-y-3 text-sm text-white/80 list-disc list-inside leading-relaxed">
                  <li>Fulfill orders</li>
                  <li>Maintain business records</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes</li>
                </ul>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  After this period, information may be securely deleted or anonymized.
                </p>
              </section>

              <section id="third-party-websites" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">9. Third-Party Websites</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Our website may contain links to third-party websites. Amazing Groups is not responsible for the privacy practices, content, or policies of external websites.
                </p>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  We encourage users to review the privacy policies of those websites before sharing personal information.
                </p>
              </section>

              <section id="your-rights" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">10. Your Rights</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Subject to applicable laws, you may have the right to:
                </p>
                <ul className="mt-4 space-y-3 text-sm text-white/80 list-disc list-inside leading-relaxed">
                  <li>Request access to your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of personal data</li>
                  <li>Withdraw consent where applicable</li>
                  <li>Object to certain processing activities</li>
                </ul>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  To exercise these rights, please contact us using the details below.
                </p>
              </section>

              <section id="childrens-privacy" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">11. Children's Privacy</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Our website and services are intended for business and general users and are not directed toward individuals under the age of 18. We do not knowingly collect personal information from minors.
                </p>
              </section>

              <section id="changes-policy" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">12. Changes to This Privacy Policy</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Amazing Groups reserves the right to modify this Privacy Policy at any time. Updated versions will be posted on this page with the revised effective date.
                </p>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  Continued use of the website after changes are published constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              <section id="contact-us" className="animate-fade-up rounded-[2rem] border border-[#d4af37]/15 bg-[#15151a]/95 p-8">
                <h2 className="font-display text-2xl text-white leading-tight mb-4">13. Contact Us</h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Amazing Groups
                </p>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  📍 Mumbai, Maharashtra, India
                </p>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  📧 Email: <a href="mailto:info@amazinggroups.in" className="text-amber-brand hover:text-white transition-colors">info@amazinggroups.in</a>
                </p>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  📞 Phone: +91 XXXXX XXXXX
                </p>
                <p className="text-sm text-white/80 leading-relaxed mt-4">
                  🌐 Website: <a href="http://www.amazinggroups.in" target="_blank" rel="noopener noreferrer" className="text-amber-brand hover:text-white transition-colors">www.amazinggroups.in</a>
                </p>
                <p className="text-sm text-white/80 leading-relaxed mt-6">
                  If you have any questions regarding this Privacy Policy or how your information is handled, please contact us.
                </p>
              </section>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
