import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock } from "lucide-react";
import { BRAND } from "../lib/brand";

const AdminLogin = () => {
  const { admin, login, checking } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (checking) return <div className="min-h-screen bg-[#0e0e13]" />;
  if (admin) return <Navigate to="/admin-x9k2l-secret/dashboard" replace />;

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
    <div className="min-h-screen hero-gradient flex items-center justify-center px-6" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src={BRAND.logoSrc} alt="Amazing Groups" className="w-16 h-16 mx-auto rounded-xl shadow-lg mb-4 object-cover" />
          <div className="font-display text-2xl text-white">Amazing Groups</div>
          <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mt-2">Admin Console</div>
        </div>

        <div className="bg-[#15151a] rounded-2xl card-shadow p-8 border border-[#d4af37]/15">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#d4af37]/15 text-amber-brand flex items-center justify-center">
              <Lock size={16} />
            </div>
            <h1 className="font-display text-xl text-white">Administrator Sign In</h1>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold block mb-2">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus
                className="w-full bg-[#0e0e13] border border-[#d4af37]/20 focus:border-amber-brand outline-none px-4 py-3 rounded-lg text-white"
                data-testid="admin-username-input" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold block mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-[#0e0e13] border border-[#d4af37]/20 focus:border-amber-brand outline-none px-4 py-3 rounded-lg text-white"
                data-testid="admin-password-input" />
            </div>
            {error && <div className="text-sm text-red-600" data-testid="admin-login-error">{error}</div>}
            <button type="submit" disabled={submitting} className="btn-amber w-full mt-2 disabled:opacity-50" data-testid="admin-login-submit">
              {submitting ? "Authenticating..." : "Enter Console"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
