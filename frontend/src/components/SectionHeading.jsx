const SectionHeading = ({ eyebrow, title, subtitle, align = "center" }) => {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"} mb-16`}>
      {eyebrow && <div className="eyebrow mb-5">{eyebrow}</div>}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-[1.05] mb-6">
        {title}
      </h2>
      <div className={`divider-gold ${align === "center" ? "mx-auto" : ""} mb-6`} />
      {subtitle && (
        <p className="text-neutral-400 font-light text-base md:text-lg leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeading;
