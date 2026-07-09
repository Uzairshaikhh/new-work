import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { api, resolveMedia } from "../lib/api";

const DISMISSED_KEY = "ag_popup_dismissed";

const PopupManager = () => {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    api.get("/popup").then((r) => {
      const data = r.data;
      if (!data?.enabled || !data?.title) return;
      const dismissed = sessionStorage.getItem(DISMISSED_KEY);
      if (dismissed === data.title) return;
      setPopup(data);
      setTimeout(() => setVisible(true), data.delay_ms ?? 3000);
    }).catch(() => {});
  }, []);

  const dismiss = () => {
    setVisible(false);
    if (popup?.title) sessionStorage.setItem(DISMISSED_KEY, popup.title);
  };

  if (!visible || !popup) return null;

  return (
    <div
      className="fixed inset-0 z-[160] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={dismiss}
    >
      <div
        className="bg-[#0e0e0e] border border-[#d4af37]/30 w-full max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-black/60 rounded-full text-white hover:text-amber-brand transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {popup.image_url && (
          <img src={resolveMedia(popup.image_url, 600)} alt="" className="w-full h-48 object-cover" />
        )}

        <div className="p-7">
          <h3 className="font-display text-2xl text-white mb-2">{popup.title}</h3>
          {popup.description && <p className="text-gray-400 text-sm leading-relaxed mb-5">{popup.description}</p>}
          {popup.cta_text && popup.cta_url && (
            <a
              href={popup.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="btn-amber w-full !py-3 text-center block"
            >
              {popup.cta_text}
            </a>
          )}
          <button onClick={dismiss} className="mt-3 w-full text-xs text-gray-600 hover:text-gray-400 transition-colors">
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupManager;
