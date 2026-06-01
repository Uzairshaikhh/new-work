const SectionHeading = ({ eyebrow, title, subtitle, align = "center" }) => {
  return (
    <div className={`max-w-xl ${align === "center" ? "mx-auto text-center" : "text-left"} mb-8`}>
      {eyebrow && (
        <div className="text-[10px] uppercase tracking-[0.3em] text-amber-brand font-semibold mb-2">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-white leading-[1.15] underline-amber inline-block">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-sm md:text-[15px] leading-relaxed mt-6 max-w-lg mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
