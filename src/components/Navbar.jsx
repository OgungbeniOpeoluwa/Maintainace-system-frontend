import { Link, useNavigate } from "react-router-dom";
import { Wrench, LogOut, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <Link to="/" className="brand">
        <span className="brand-icon"><Wrench size={18} strokeWidth={2.5} /></span>
        Campus Works
      </Link>
      <div className="links">
        {user && (
          <Link to="/change-password" className="nav-link">
            <KeyRound size={15} /> Password
          </Link>
        )}
        {user && (
          <div className="user-chip">
            <span className="user-avatar">{initials(user.fullName)}</span>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3 }}>
              <span>{user.fullName}</span>
              <span className="role-tag">{user.role.replace("_", " / ")}</span>
            </span>
          </div>
        )}
        {user && (
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={15} /> Logout
          </button>
        )}
      </div>
    </div>
  );
}
