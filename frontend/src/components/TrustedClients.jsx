const CLIENTS = [
  "TATA", "Infosys", "HDFC BANK", "ICICI Bank", "Deloitte", "Wipro", "Reliance", "Airtel", "L&T", "Mahindra",
];

const TrustedClients = () => {
  return (
    <section className="py-14 bg-[#15151a] border-y border-[#d4af37]/15" data-testid="trusted-clients-section">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-2">
            Trusted by Businesses Across India
          </div>
          <p className="text-sm text-gray-500">We've served 500+ companies for bulk gifting needs.</p>
        </div>

        <div className="marquee">
          <div className="marquee-track">
            {CLIENTS.map((c) => (
              <div
                key={c}
                className="font-display font-bold text-2xl md:text-3xl text-gray-500 hover:text-white transition-colors whitespace-nowrap tracking-tight"
              >
                {c}
              </div>
            ))}
          </div>
          <div className="marquee-track" aria-hidden="true">
            {CLIENTS.map((c) => (
              <div
                key={`dup-${c}`}
                className="font-display font-bold text-2xl md:text-3xl text-gray-500 whitespace-nowrap tracking-tight"
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedClients;
