const SectionHeading = ({ eyebrow, title, subtitle, align = "center" }) => {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"} mb-14`}>
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.3em] text-amber-brand font-semibold mb-4">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-[1.15] underline-amber inline-block">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 text-base md:text-lg leading-relaxed mt-10 max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
