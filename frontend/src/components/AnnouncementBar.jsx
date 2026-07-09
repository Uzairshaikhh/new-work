import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { api } from "../lib/api";

const COLOR_MAP = {
  gold: "bg-[#d4af37] text-[#0a0a0d]",
  red: "bg-red-600 text-white",
  green: "bg-emerald-600 text-white",
  blue: "bg-blue-600 text-white",
};

const AnnouncementBar = () => {
  const [bar, setBar] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Try localStorage cache first (populated by Home.jsx)
    try {
      const cached = JSON.parse(localStorage.getItem("ag_home_v1"));
      if (cached?.settings?.announcement_bar_enabled && cached.settings.announcement_bar_text) {
        setBar(cached.settings);
        return;
      }
    } catch {}
    // Fall back to API
    api.get("/settings").then((r) => {
      if (r.data?.announcement_bar_enabled && r.data.announcement_bar_text) {
        setBar(r.data);
      }
    }).catch(() => {});
  }, []);

  if (!bar || dismissed) return null;

  const colorCls = COLOR_MAP[bar.announcement_bar_color] || COLOR_MAP.gold;

  return (
    <div className={`relative ${colorCls} py-2 px-4 text-center text-xs font-semibold tracking-wide`}>
      {bar.announcement_bar_text}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
