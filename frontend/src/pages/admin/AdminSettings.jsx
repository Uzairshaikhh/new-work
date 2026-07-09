import { useEffect, useState, useRef } from "react";
import { api, resolveMedia } from "../../lib/api";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";

const AvatarUpload = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const ref = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3 mb-3">
      {value ? (
        <img
          src={resolveMedia(value, 120)}
          alt=""
          className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]/40"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-[#15151a] border-2 border-dashed border-[#D4AF37]/30 flex items-center justify-center">
          <Upload size={16} className="text-gray-500" />
        </div>
      )}
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="btn-ghost-gold !py-2 !px-4 !text-xs disabled:opacity-50"
      >
        {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
        {uploading ? "Uploading…" : value ? "Change Photo" : "Upload Photo"}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
};

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementColor, setAnnouncementColor] = useState("gold");
  const [statsClients, setStatsClients] = useState("500+");
  const [statsYears, setStatsYears] = useState("10+");
  const [statsProducts, setStatsProducts] = useState("1000+");
  const [statsCities, setStatsCities] = useState("50+");

  const [tiers, setTiers] = useState([
    { qty: 100, price: "₹120" },
    { qty: 500, price: "₹95" },
    { qty: 1000, price: "₹80" },
    { qty: 5000, price: "₹65" },
  ]);
 const [clientsTitle, setClientsTitle] = useState(
  "Trusted by Businesses Across India"
);

const [clientsStats, setClientsStats] = useState(
  "We've served 500+ companies for bulk gifting needs."
);

const [clientsBrands, setClientsBrands] = useState([
  "TATA",
  "Infosys",
  "HDFC BANK",
  "ICICI Bank",
  "Deloitte",
  "Wipro",
]);
const [whatsappUrl, setWhatsappUrl] = useState("");
const [facebookUrl, setFacebookUrl] = useState("");
const [instagramUrl, setInstagramUrl] = useState("");
const [linkedinUrl, setLinkedinUrl] = useState("");
const [youtubeUrl, setYoutubeUrl] = useState("");
const [testimonials, setTestimonials] = useState([
  {
    name: "",
    role: "",
    avatar: "",
    body: "",
  },
]);

  useEffect(() => {
  api
    .get("/settings")
    .then((r) => {
      if (r.data?.bulk_pricing) {
        setTiers(r.data.bulk_pricing);
      }
      if (r.data?.trusted_clients_title) {
  setClientsTitle(r.data.trusted_clients_title);
}

if (r.data?.trusted_clients_stats) {
  setClientsStats(r.data.trusted_clients_stats);
}

if (r.data?.trusted_clients_brands) {
  setClientsBrands(r.data.trusted_clients_brands);
}

if (r.data?.announcement_bar_enabled !== undefined) setAnnouncementEnabled(r.data.announcement_bar_enabled);
if (r.data?.announcement_bar_text) setAnnouncementText(r.data.announcement_bar_text);
if (r.data?.announcement_bar_color) setAnnouncementColor(r.data.announcement_bar_color);
if (r.data?.stats_clients) setStatsClients(r.data.stats_clients);
if (r.data?.stats_years) setStatsYears(r.data.stats_years);
if (r.data?.stats_products) setStatsProducts(r.data.stats_products);
if (r.data?.stats_cities) setStatsCities(r.data.stats_cities);
if (r.data?.whatsapp_url) setWhatsappUrl(r.data.whatsapp_url);
if (r.data?.facebook_url) setFacebookUrl(r.data.facebook_url);
if (r.data?.instagram_url) setInstagramUrl(r.data.instagram_url);
if (r.data?.linkedin_url) setLinkedinUrl(r.data.linkedin_url);
if (r.data?.youtube_url) setYoutubeUrl(r.data.youtube_url);
if (r.data?.testimonials) {
  setTestimonials(r.data.testimonials);
}
})
    .catch(() => {})
    .finally(() => setLoading(false));
}, []);

  const addTier = () => {
    setTiers([
      ...tiers,
      {
        qty: "",
        price: "",
      },
    ]);
  };

  const removeTier = (index) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const save = async () => {
    try {
     await api.put("/admin/settings", {
  bulk_pricing: tiers,
  trusted_clients_title: clientsTitle,
  trusted_clients_brands: clientsBrands,
  trusted_clients_stats: clientsStats,
  whatsapp_url: whatsappUrl,
  facebook_url: facebookUrl,
  instagram_url: instagramUrl,
  linkedin_url: linkedinUrl,
  youtube_url: youtubeUrl,
  testimonials: testimonials,
  announcement_bar_enabled: announcementEnabled,
  announcement_bar_text: announcementText,
  announcement_bar_color: announcementColor,
  stats_clients: statsClients,
  stats_years: statsYears,
  stats_products: statsProducts,
  stats_cities: statsCities,
});
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  if (loading) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  return (
    <div className="p-10 max-w-4xl">
      <h1 className="text-3xl text-white mb-8">
        Homepage Bulk Pricing
      </h1>

      {tiers.map((tier, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="100+ pcs"
            value={tier.qty}
            onChange={(e) => {
              const updated = [...tiers];
              updated[index].qty = e.target.value;
              setTiers(updated);
            }}
            className="bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
          />

          <input
            type="text"
            placeholder="₹120"
            value={tier.price}
            onChange={(e) => {
              const updated = [...tiers];
              updated[index].price = e.target.value;
              setTiers(updated);
            }}
            className="bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
          />

          <button
            onClick={() => removeTier(index)}
            className="border border-red-500 text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
      <h2 className="text-2xl text-white mt-12 mb-6">
  Trusted Clients Section
</h2>

<input
  value={clientsTitle}
  onChange={(e) => setClientsTitle(e.target.value)}
  placeholder="Trusted by Businesses Across India"
  className="w-full mb-4 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
/>

<textarea
  value={clientsStats}
  onChange={(e) => setClientsStats(e.target.value)}
  placeholder="We've served 500+ companies..."
  className="w-full mb-4 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
/>

{clientsBrands.map((brand, index) => (
  <div key={index} className="flex gap-3 mb-3">
    <input
      value={brand}
      onChange={(e) => {
        const updated = [...clientsBrands];
        updated[index] = e.target.value;
        setClientsBrands(updated);
      }}
      className="flex-1 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
    />

    <button
      type="button"
      onClick={() =>
        setClientsBrands(clientsBrands.filter((_, i) => i !== index))
      }
      className="border border-red-500 text-red-500 px-4"
    >
      Delete
    </button>
  </div>
))}

<button
  type="button"
  onClick={() => setClientsBrands([...clientsBrands, ""])}
  className="btn-primary mb-8"
>
  Add Brand
</button>

<h2 className="text-2xl text-white mt-12 mb-6">
  Social Media Links
</h2>

<input
  value={whatsappUrl}
  onChange={(e) => setWhatsappUrl(e.target.value)}
  placeholder="WhatsApp URL"
  className="w-full mb-3 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
/>

<input
  value={facebookUrl}
  onChange={(e) => setFacebookUrl(e.target.value)}
  placeholder="Facebook URL"
  className="w-full mb-3 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
/>

<input
  value={instagramUrl}
  onChange={(e) => setInstagramUrl(e.target.value)}
  placeholder="Instagram URL"
  className="w-full mb-3 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
/>

<input
  value={linkedinUrl}
  onChange={(e) => setLinkedinUrl(e.target.value)}
  placeholder="LinkedIn URL"
  className="w-full mb-3 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
/>

<input
  value={youtubeUrl}
  onChange={(e) => setYoutubeUrl(e.target.value)}
  placeholder="YouTube URL"
  className="w-full mb-6 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
/>

<h2 className="text-2xl text-white mt-12 mb-6">
  Testimonials
</h2>

{testimonials.map((t, index) => (
  <div
    key={index}
    className="border border-[#D4AF37]/20 p-4 rounded-lg mb-4"
  >
    <input
      value={t.name}
      onChange={(e) => {
        const updated = [...testimonials];
        updated[index].name = e.target.value;
        setTestimonials(updated);
      }}
      placeholder="Name"
      className="w-full mb-3 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
    />

    <input
      value={t.role}
      onChange={(e) => {
        const updated = [...testimonials];
        updated[index].role = e.target.value;
        setTestimonials(updated);
      }}
      placeholder="Role"
      className="w-full mb-3 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
    />

    <AvatarUpload
      value={t.avatar}
      onChange={(url) => {
        const updated = [...testimonials];
        updated[index].avatar = url;
        setTestimonials(updated);
      }}
    />

    <textarea
      value={t.body}
      onChange={(e) => {
        const updated = [...testimonials];
        updated[index].body = e.target.value;
        setTestimonials(updated);
      }}
      placeholder="Review"
      className="w-full mb-3 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
    />

    <button
      type="button"
      onClick={() =>
        setTestimonials(
          testimonials.filter((_, i) => i !== index)
        )
      }
      className="border border-red-500 text-red-500 px-4 py-2"
    >
      Delete Review
    </button>
  </div>
))}

<button
  type="button"
  onClick={() =>
    setTestimonials([
      ...testimonials,
      {
        name: "",
        role: "",
        avatar: "",
        body: "",
      },
    ])
  }
  className="btn-primary mb-8"
>
  Add Review
</button>
<h2 className="text-2xl text-white mt-12 mb-6">Announcement Bar</h2>
<p className="text-xs text-neutral-400 mb-4">Show a dismissible banner at the top of every page on the website.</p>

<label className="flex items-center gap-3 mb-4 cursor-pointer">
  <input
    type="checkbox"
    checked={announcementEnabled}
    onChange={(e) => setAnnouncementEnabled(e.target.checked)}
    className="w-4 h-4 accent-[#D4AF37]"
  />
  <span className="text-sm text-neutral-300">Enable Announcement Bar</span>
</label>

<input
  value={announcementText}
  onChange={(e) => setAnnouncementText(e.target.value)}
  placeholder="e.g. 🎉 Free shipping on orders above ₹5000 | Call +91 98867 28837"
  className="w-full mb-4 bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
/>

<div className="mb-4">
  <label className="eyebrow block mb-2">Bar Color</label>
  <select
    value={announcementColor}
    onChange={(e) => setAnnouncementColor(e.target.value)}
    className="bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white"
  >
    <option value="gold">Gold</option>
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="blue">Blue</option>
  </select>
</div>

<h2 className="text-2xl text-white mt-12 mb-2">Stats Counter</h2>
<p className="text-xs text-neutral-400 mb-6">Numbers displayed in the animated stats section on the homepage (e.g. "500+", "10+").</p>
<div className="grid grid-cols-2 gap-4 mb-4">
  {[
    { label: "Happy Clients", val: statsClients, set: setStatsClients, ph: "500+" },
    { label: "Years Experience", val: statsYears, set: setStatsYears, ph: "10+" },
    { label: "Products Delivered", val: statsProducts, set: setStatsProducts, ph: "1000+" },
    { label: "Cities Covered", val: statsCities, set: setStatsCities, ph: "50+" },
  ].map((s) => (
    <div key={s.label}>
      <label className="eyebrow block mb-2">{s.label}</label>
      <input value={s.val} onChange={(e) => s.set(e.target.value)} placeholder={s.ph} className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 px-4 py-3 text-white" />
    </div>
  ))}
</div>

      <div className="flex gap-4 mt-6">
        <button onClick={addTier} className="btn-primary">
          Add Tier
        </button>

        <button onClick={save} className="btn-amber">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;