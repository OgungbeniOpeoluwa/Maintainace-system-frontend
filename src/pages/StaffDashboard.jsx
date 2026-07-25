import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, MapPin, Calendar, User as UserIcon, Inbox, Building2, Trash2, History } from "lucide-react";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import PriorityChip from "../components/PriorityChip";
import EmptyState from "../components/EmptyState";
import TicketSkeleton from "../components/TicketSkeleton";
import WelcomeBanner from "../components/WelcomeBanner";
import HistoryModal from "../components/HistoryModal";
import { ticketCode, fileUrl } from "../utils";

export default function StaffDashboard() {
  const [tab, setTab] = useState("mine"); // "mine" | "department"
  const [myRequests, setMyRequests] = useState([]);
  const [deptRequests, setDeptRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [historyRequest, setHistoryRequest] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get("/requests?page=0&size=20"),
      api.get("/requests/department?page=0&size=20"),
    ]).then(([mineRes, deptRes]) => {
      setMyRequests(mineRes.data.content || []);
      setDeptRequests(deptRes.data.content || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (req) => {
    if (!window.confirm(`Delete "${req.title}"? This can't be undone.`)) return;
    setDeletingId(req.id);
    setError("");
    try {
      await api.delete(`/requests/${req.id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this request.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container">
      <WelcomeBanner variant="staff" />
      <div className="toolbar">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <span className="eyebrow">Staff View</span>
          <h2>Service Requests</h2>
        </div>
        <Link to="/submit-request" className="btn-small" style={{ background: "var(--ink)" }}>
          <Plus size={15} /> New Request
        </Link>
      </div>

      <div className="tab-group" style={{ marginBottom: 20 }}>
        <button className={`tab-btn ${tab === "mine" ? "active" : ""}`} onClick={() => setTab("mine")}>
          <Inbox size={15} /> My Requests ({myRequests.length})
        </button>
        <button className={`tab-btn ${tab === "department" ? "active" : ""}`} onClick={() => setTab("department")}>
          <Building2 size={15} /> Department Requests ({deptRequests.length})
        </button>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {loading && <TicketSkeleton count={3} />}

      {!loading && tab === "mine" && (
        myRequests.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No requests yet"
            description="Submit your first maintenance request to get it into the queue."
            action={
              <Link to="/submit-request" className="btn-small" style={{ background: "var(--blueprint)" }}>
                <Plus size={15} /> New Request
              </Link>
            }
          />
        ) : (
          myRequests.map((r) => (
            <div key={r.id} className={`ticket priority-${r.priority}`}>
              <div className="ticket-main">
                <div className="ticket-code">{ticketCode(r.id)}</div>
                <div className="ticket-title">{r.title}</div>
                <div className="ticket-meta">
                  <span><MapPin size={13} /> {r.location}</span>
                  <span><Calendar size={13} /> {new Date(r.createdAt).toLocaleDateString()}</span>
                  <PriorityChip priority={r.priority} />
                </div>
              </div>
              <div className="ticket-actions">
                {r.imageUrl && (
                  <a href={fileUrl(r.imageUrl)} target="_blank" rel="noreferrer">
                    <img src={fileUrl(r.imageUrl)} alt="Evidence" className="ticket-thumb" />
                  </a>
                )}
                <StatusBadge status={r.status} />
                <button
                  className="btn-small"
                  style={{ background: "var(--text-muted)" }}
                  onClick={() => setHistoryRequest(r)}
                  title="View history"
                >
                  <History size={14} />
                </button>
                {r.status === "PENDING" && (
                  <button
                    className="btn-small"
                    style={{ background: "var(--danger)" }}
                    disabled={deletingId === r.id}
                    onClick={() => handleDelete(r)}
                    title="Delete this request"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )
      )}

      {!loading && tab === "department" && (
        deptRequests.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Nothing from your department yet"
            description="Requests submitted by anyone in your department will show up here."
          />
        ) : (
          deptRequests.map((r) => (
            <div key={r.id} className={`ticket priority-${r.priority}`}>
              <div className="ticket-main">
                <div className="ticket-code">{ticketCode(r.id)}</div>
                <div className="ticket-title">{r.title}</div>
                <div className="ticket-meta">
                  <span><UserIcon size={13} /> {r.submitterName || "Unknown"}</span>
                  <span><MapPin size={13} /> {r.location}</span>
                  <span><Calendar size={13} /> {new Date(r.createdAt).toLocaleDateString()}</span>
                  <PriorityChip priority={r.priority} />
                </div>
              </div>
              <div className="ticket-actions">
                {r.imageUrl && (
                  <a href={fileUrl(r.imageUrl)} target="_blank" rel="noreferrer">
                    <img src={fileUrl(r.imageUrl)} alt="Evidence" className="ticket-thumb" />
                  </a>
                )}
                <StatusBadge status={r.status} />
                <button
                  className="btn-small"
                  style={{ background: "var(--text-muted)" }}
                  onClick={() => setHistoryRequest(r)}
                  title="View history"
                >
                  <History size={14} />
                </button>
              </div>
            </div>
          ))
        )
      )}

      {historyRequest && (
        <HistoryModal
          requestId={historyRequest.id}
          requestTitle={historyRequest.title}
          onClose={() => setHistoryRequest(null)}
        />
      )}
    </div>
  );
}
