import { SOCIAL_LINKS } from "../lib/socialLinks";

const SocialLinks = ({ settings }) => {
  const links = SOCIAL_LINKS.map((link) => {
  if (link.id === "whatsapp")
    return {
      ...link,
      url: settings?.whatsapp_url || link.url,
    };

  if (link.id === "facebook")
    return {
      ...link,
      url: settings?.facebook_url || link.url,
    };

  if (link.id === "instagram")
    return {
      ...link,
      url: settings?.instagram_url || link.url,
    };

  if (link.id === "linkedin")
    return {
      ...link,
      url: settings?.linkedin_url || link.url,
    };

  if (link.id === "youtube")
    return {
      ...link,
      url: settings?.youtube_url || link.url,
    };

  return link;
});
  return (
    <section className="py-6 px-6 lg:px-10" data-testid="social-links-section">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-center gap-6">
          {links.map(({ id, icon: Icon, url, ariaLabel, label }) => (
            <a
              key={id}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              title={label}
              className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#15151a] border border-[#d4af37]/20 text-gray-400 hover:text-amber-brand hover:border-[#d4af37]/60 transition-all duration-300 hover:scale-110"
              data-testid={`social-link-${id}`}
            >
              <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialLinks;
