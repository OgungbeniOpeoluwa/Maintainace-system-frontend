import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wrench, LogOut, KeyRound, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
        <span className="brand-icon"><Wrench size={18} strokeWidth={2.5} /></span>
        Campus Works
      </Link>

      {user && (
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      <div className={`links ${menuOpen ? "open" : ""}`}>
        {user && (
          <Link to="/change-password" className="nav-link" onClick={() => setMenuOpen(false)}>
            <KeyRound size={15} /> Password
          </Link>
        )}
        {user && (
          <div className="user-chip">
            <span className="user-avatar">{initials(user.fullName)}</span>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.3, minWidth: 0 }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.fullName}</span>
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
