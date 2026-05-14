import { useState, useRef } from "react";
import { api, resolveMedia } from "../lib/api";
import { Upload, Loader2 } from "lucide-react";

// Reusable file uploader for admin forms.
// Calls onChange(url) with the resulting URL (either uploaded file or external URL).
const FileUploader = ({ value, onChange, accept = "image/*", label = "Media", testid = "uploader" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const upload = async (file) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } catch (e) {
      setError("Upload failed. Try a smaller file or use an external URL.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid={testid}>
      <label className="eyebrow block mb-3">{label}</label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Paste image / video URL"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white text-sm font-light"
          data-testid={`${testid}-url`}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-ghost-gold !py-3 disabled:opacity-50"
          data-testid={`${testid}-upload-btn`}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </div>
      {error && <div className="text-xs text-red-400 mt-2">{error}</div>}
      {value && (
        <div className="mt-3">
          {accept.includes("video") ? (
            <video src={resolveMedia(value)} className="w-32 h-32 object-cover border border-[#D4AF37]/20" muted />
          ) : (
            <img src={resolveMedia(value)} alt="" className="w-32 h-32 object-cover border border-[#D4AF37]/20" />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
