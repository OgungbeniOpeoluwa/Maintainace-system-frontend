import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ClipboardList, User, Mail, Building2, Lock, ArrowRight, ArrowLeft, AlertCircle, GraduationCap, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register({ role }) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (role === "STAFF" && !form.department.trim()) {
      setError("Department is required for staff accounts.");
      return;
    }

    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password, form.department, role);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const RoleIcon = role === "STAFF" ? Briefcase : GraduationCap;

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="hero-icon"><ClipboardList size={26} strokeWidth={2.5} /></div>
        <h1>One form. No more paper slips.</h1>
        <p>
          Submit faulty electricity, plumbing, furniture, internet, classroom, or hostel
          complaints — and track every one to completion.
        </p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <Link to="/register" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 14 }}>
            <ArrowLeft size={14} /> Change role
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span className="role-choice-icon" style={{
              width: 34, height: 34,
              background: role === "STAFF" ? "var(--warning-bg)" : "var(--info-bg)",
              color: role === "STAFF" ? "var(--amber-dark)" : "var(--blueprint)",
            }}>
              <RoleIcon size={17} />
            </span>
            <h2 style={{ margin: 0 }}>Register as {role === "STAFF" ? "Staff" : "Student"}</h2>
          </div>
          <p className="sub">
            {role === "STAFF"
              ? "You'll also be able to see every request from your department."
              : "You'll be able to submit and track your own requests."}
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
              <label>
                <Building2 size={14} /> Department {role === "STAFF" ? "" : (
                  <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span>
                )}
              </label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                required={role === "STAFF"}
                placeholder={role === "STAFF" ? "e.g. Facilities, Computer Science" : "e.g. Hostel Block C"}
              />
              {role === "STAFF" && (
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 6 }}>
                  Staff can see all requests submitted by their department — this is how we know which one is yours.
                </p>
              )}
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
