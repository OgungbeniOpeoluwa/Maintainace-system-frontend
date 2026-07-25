import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ClipboardList, User, Mail, Building2, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password, form.department);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="hero-icon"><ClipboardList size={26} strokeWidth={2.5} /></div>
        <h1>One form. No more paper slips.</h1>
        <p>
          Create a student/staff account to submit faulty electricity, plumbing, furniture,
          internet, classroom, or hostel complaints — and track every one to completion.
        </p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <h2>Create account</h2>
          <p className="sub">
            Student / Staff account. Maintenance Officer accounts are created by an administrator.
          </p>
          {error && <div className="error-msg"><AlertCircle size={16} />{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><User size={14} /> Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label><Mail size={14} /> Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label><Building2 size={14} /> Department / Hostel <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
              <input name="department" value={form.department} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label><Lock size={14} /> Password</label>
              <input type="password" name="password" minLength={6} value={form.password} onChange={handleChange} required />
            </div>
            <button className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : <>Register <ArrowRight size={16} /></>}
            </button>
          </form>
          <p style={{ marginTop: 18, fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--blueprint)", fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
