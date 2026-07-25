import { Link } from "react-router-dom";
import { GraduationCap, Briefcase, ArrowRight, Wrench } from "lucide-react";

export default function RoleSelect() {
  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="hero-icon"><Wrench size={26} strokeWidth={2.5} /></div>
        <h1>Let's get you set up.</h1>
        <p>
          Tell us which kind of account you need — the form after this will be tailored to it.
        </p>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card" style={{ maxWidth: 440 }}>
          <h2>Are you a Student or Staff?</h2>
          <p className="sub">Pick one to continue registering.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
            <Link to="/register/student" className="role-choice-card">
              <span className="role-choice-icon" style={{ background: "var(--info-bg)", color: "var(--blueprint)" }}>
                <GraduationCap size={22} />
              </span>
              <span style={{ flex: 1 }}>
                <span className="role-choice-title">I'm a Student</span>
                <span className="role-choice-desc">Submit and track your own maintenance requests.</span>
              </span>
              <ArrowRight size={18} style={{ color: "var(--text-muted)" }} />
            </Link>

            <Link to="/register/staff" className="role-choice-card">
              <span className="role-choice-icon" style={{ background: "var(--warning-bg)", color: "var(--amber-dark)" }}>
                <Briefcase size={22} />
              </span>
              <span style={{ flex: 1 }}>
                <span className="role-choice-title">I'm Staff</span>
                <span className="role-choice-desc">Also see every request from your whole department.</span>
              </span>
              <ArrowRight size={18} style={{ color: "var(--text-muted)" }} />
            </Link>
          </div>

          <p style={{ marginTop: 22, fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Already have an account? <Link to="/login" style={{ color: "var(--blueprint)", fontWeight: 600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
