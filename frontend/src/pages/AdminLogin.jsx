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

  if (checking) return <div className="min-h-screen bg-cream-soft" />;
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
          <div className="w-14 h-14 mx-auto bg-navy text-amber-brand flex items-center justify-center rounded-xl font-display text-2xl mb-4 shadow-lg">AG</div>
          <div className="font-display text-2xl text-navy">Amazing Groups</div>
          <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mt-2">Admin Console</div>
        </div>

        <div className="bg-white rounded-2xl card-shadow p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-amber-soft text-amber-brand flex items-center justify-center">
              <Lock size={16} />
            </div>
            <h1 className="font-display text-xl text-navy">Administrator Sign In</h1>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold block mb-2">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus
                className="w-full bg-cream-soft border border-gray-200 focus:border-amber-brand outline-none px-4 py-3 rounded-lg text-navy"
                data-testid="admin-username-input" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold block mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-cream-soft border border-gray-200 focus:border-amber-brand outline-none px-4 py-3 rounded-lg text-navy"
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
