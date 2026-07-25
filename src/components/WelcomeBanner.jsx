import { useState } from "react";
import { X, ClipboardPlus, Search, Trash2, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function WelcomeBanner({ variant = "student" }) {
  const { user } = useAuth();
  const storageKey = `welcome_dismissed_${user?.id}`;
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(storageKey) === "true");

  if (dismissed || !user) return null;

  const handleDismiss = () => {
    localStorage.setItem(storageKey, "true");
    setDismissed(true);
  };

  const firstName = user.fullName?.split(" ")[0] || "there";

  return (
    <div className="card welcome-banner">
      <button className="welcome-dismiss" onClick={handleDismiss} aria-label="Dismiss">
        <X size={16} />
      </button>
      <h3 style={{ marginTop: 0 }}>Welcome, {firstName} 👋</h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>
        Here's how to get a maintenance issue fixed:
      </p>
      <div className="welcome-steps">
        <div className="welcome-step">
          <span className="welcome-step-icon"><ClipboardPlus size={18} /></span>
          <div>
            <strong>1. Submit a request</strong>
            <p>Click "New Request", pick a category, add the location, and describe the issue. A photo helps but isn't required.</p>
          </div>
        </div>
        <div className="welcome-step">
          <span className="welcome-step-icon"><Search size={18} /></span>
          <div>
            <strong>2. Track its status</strong>
            <p>Watch it move from <em>Pending</em> → <em>Assigned</em> → <em>In Progress</em> → <em>Completed</em> right here.</p>
          </div>
        </div>
        <div className="welcome-step">
          <span className="welcome-step-icon"><Trash2 size={18} /></span>
          <div>
            <strong>3. Changed your mind?</strong>
            <p>You can delete a request yourself as long as it's still <em>Pending</em> — once it's assigned, ask an admin.</p>
          </div>
        </div>
        {variant === "staff" && (
          <div className="welcome-step">
            <span className="welcome-step-icon"><Building2 size={18} /></span>
            <div>
              <strong>4. See your department's requests</strong>
              <p>The "Department Requests" tab shows everything submitted by your colleagues too.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
