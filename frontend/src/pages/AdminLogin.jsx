import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const { admin, login, checking } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (checking) {
    return <div className="min-h-screen bg-[#0a0a0a]" />;
  }
  if (admin) {
    return <Navigate to="/admin-x9k2l-secret/dashboard" replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/admin-x9k2l-secret/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 grain" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="font-display text-3xl gold-text tracking-[0.05em]">Amazing Groups</div>
          <div className="text-[10px] tracking-[0.45em] text-neutral-500 uppercase mt-2">
            Private · Atelier Access
          </div>
        </div>

        <div className="bg-[#0e0e0e] border border-[#D4AF37]/20 p-10 gold-glow">
          <div className="flex items-center gap-3 mb-8">
            <Lock size={18} strokeWidth={1.4} className="text-[#D4AF37]" />
            <h1 className="font-display text-2xl text-white">Administrator Sign In</h1>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="eyebrow block mb-3">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light tracking-wide transition-colors"
                data-testid="admin-username-input"
              />
            </div>

            <div>
              <label className="eyebrow block mb-3">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 focus:border-[#D4AF37] outline-none px-4 py-3 text-white font-light tracking-wide transition-colors"
                data-testid="admin-password-input"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 font-light" data-testid="admin-login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="admin-login-submit"
            >
              {submitting ? "Authenticating..." : "Enter Atelier"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
