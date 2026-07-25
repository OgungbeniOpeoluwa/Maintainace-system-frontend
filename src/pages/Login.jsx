import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Wrench, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="hero-icon"><Wrench size={26} strokeWidth={2.5} /></div>
        <h1>Report it. Track it. Get it fixed.</h1>
        <p>
          The university's single system for logging faults, routing them to the right
          maintenance officer, and following every job through to completion.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">3</div>
            <div className="label">User Roles</div>
          </div>
          <div className="hero-stat">
            <div className="num">6</div>
            <div className="label">Request Categories</div>
          </div>
          <div className="hero-stat">
            <div className="num">24/7</div>
            <div className="label">Submission</div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <h2>Sign in</h2>
          <p className="sub">Enter your credentials to open your dashboard.</p>
          {error && <div className="error-msg"><AlertCircle size={16} />{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><Mail size={14} /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label><Lock size={14} /> Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn-primary" disabled={loading}>
              {loading ? "Signing in..." : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>
          <p style={{ marginTop: 18, fontSize: "0.88rem", color: "var(--text-muted)" }}>
            No account? <Link to="/register" style={{ color: "var(--blueprint)", fontWeight: 600 }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
