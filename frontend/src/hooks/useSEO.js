import { useEffect } from "react";

const BRAND = "Amazing Groups";

// Lightweight SEO: sets document.title + meta description per page.
const useSEO = ({ title, description }) => {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${BRAND}` : `${BRAND} · Bespoke Gifts, Mumbai`;
    document.title = fullTitle;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    // OG title for sharing
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", fullTitle);
  }, [title, description]);
};

export default useSEO;
