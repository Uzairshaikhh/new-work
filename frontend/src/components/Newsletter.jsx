import { Mail } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-8 px-6 lg:px-10" data-testid="newsletter-section">
      <div className="max-w-[1280px] mx-auto bg-[#15151a] border border-[#d4af37]/20 rounded-lg p-5 md:p-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 text-center md:text-left">
          <div className="font-display text-lg md:text-xl text-white leading-tight">
            Get latest offers on bulk deals
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Subscribe to our newsletter and never miss an update!
          </div>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md"
          data-testid="newsletter-form"
        >
          <div className="relative flex-1">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-brand" />
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="w-full bg-[#0e0e13] border border-[#d4af37]/20 focus:border-amber-brand outline-none pl-9 pr-3 py-2.5 rounded text-sm text-white placeholder:text-gray-500"
              data-testid="newsletter-input"
            />
          </div>
          <button type="submit" className="btn-primary !py-2.5 !px-5 !text-sm" data-testid="newsletter-submit">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
