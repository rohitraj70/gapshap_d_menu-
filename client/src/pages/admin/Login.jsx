import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brown-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-cream rounded-xl2 shadow-soft p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="w-14 h-14 rounded-full bg-brown text-cream flex items-center justify-center mb-3">
            <Coffee size={26} />
          </span>
          <h1 className="font-display text-xl font-bold text-brown-dark">Gapshap Cafe</h1>
          <p className="text-sm text-brown-light">Admin sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brown-dark mb-1">Username</label>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-white rounded-lg px-4 py-2.5 text-sm border border-brown/10 focus:border-accent outline-none"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brown-dark mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white rounded-lg px-4 py-2.5 text-sm border border-brown/10 focus:border-accent outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white font-semibold py-3 rounded-full hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
