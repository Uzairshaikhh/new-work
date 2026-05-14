// Centralised brand constants. Update phone / WhatsApp / location here only.
export const BRAND = {
  name: "Amazing Groups",
  tagline: "Amazing Make You Happy",
  // Used in tel: links and WhatsApp deep-links (no spaces, country code prefixed)
  whatsapp: "919867288377",
  phoneTel: "+919867288377",
  phoneDisplay: "+91 9867 288 377",
  email: "amazinggroups51@gmail.com",
  locationLabel: "Jogeshwari West, Mumbai",
  mapUrl: "https://share.google/XX7cz9pEHL6qJOzvP",
  logoSrc: "/ag-logo.png",
};

export const waLink = (msg) =>
  `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg || `Hi ${BRAND.name}`)}`;
