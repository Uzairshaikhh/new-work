import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:8000";
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ag_admin_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Resolve file URLs and auto-optimize Cloudinary images (WebP, auto quality, constrained width)
export const resolveMedia = (url, width = 800) => {
  if (!url) return "";
  // Inject Cloudinary transforms: f_auto (WebP/AVIF), q_auto, constrained width
  // Only when no transformation is already present (transforms look like "f_", "w_", "q_" after /upload/)
  if (url.includes("res.cloudinary.com") && url.includes("/upload/") && !/\/upload\/[a-z]_/.test(url)) {
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/api/")) return `${BACKEND_URL}${url}`;
  return url;
};
