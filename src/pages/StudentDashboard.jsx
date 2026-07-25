import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, MapPin, Calendar, ClipboardList, Trash2, History } from "lucide-react";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import PriorityChip from "../components/PriorityChip";
import EmptyState from "../components/EmptyState";
import TicketSkeleton from "../components/TicketSkeleton";
import WelcomeBanner from "../components/WelcomeBanner";
import HistoryModal from "../components/HistoryModal";
import { ticketCode, fileUrl } from "../utils";

export default function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [historyRequest, setHistoryRequest] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/requests?page=0&size=20").then((res) => {
      setRequests(res.data.content || []);
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
      <WelcomeBanner variant="student" />
      <div className="toolbar">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <span className="eyebrow">Your Requests</span>
          <h2>My Service Requests</h2>
        </div>
        <Link to="/submit-request" className="btn-small" style={{ background: "var(--ink)" }}>
          <Plus size={15} /> New Request
        </Link>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {loading && <TicketSkeleton count={3} />}

      {!loading && requests.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No requests yet"
          description="Submit your first maintenance request to get it into the queue."
          action={
            <Link to="/submit-request" className="btn-small" style={{ background: "var(--blueprint)" }}>
              <Plus size={15} /> New Request
            </Link>
          }
        />
      )}

      {!loading && requests.map((r) => (
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
      ))}

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
