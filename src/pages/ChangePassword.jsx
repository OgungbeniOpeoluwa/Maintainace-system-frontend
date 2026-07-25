import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, Lock, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const { user, clearMustChangePassword } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    setLoading(true);
    try {
      await api.put("/auth/change-password", { currentPassword, newPassword });
      clearMustChangePassword();
      setSuccess("Password updated successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: "flex", justifyContent: "center", paddingTop: 60 }}>
      <div className="auth-card">
        <div className="hero-icon" style={{ background: "var(--info-bg)", color: "var(--blueprint)", marginBottom: 16 }}>
          <KeyRound size={22} strokeWidth={2.5} />
        </div>
        <h2>{user?.mustChangePassword ? "Set Your New Password" : "Change Password"}</h2>
        {user?.mustChangePassword && (
          <p className="sub">
            You're signing in with a temporary password. Set one only you know before continuing.
          </p>
        )}
        {error && <div className="error-msg"><AlertCircle size={16} />{error}</div>}
        {success && <div className="success-msg"><CheckCircle2 size={16} />{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><Lock size={14} /> Current / Temporary Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label><Lock size={14} /> New Password</label>
            <input type="password" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label><Lock size={14} /> Confirm New Password</label>
            <input type="password" minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? "Updating..." : <>Update Password <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
