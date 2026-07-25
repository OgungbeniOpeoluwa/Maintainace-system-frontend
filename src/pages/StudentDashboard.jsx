import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, MapPin, Calendar, ClipboardList } from "lucide-react";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import PriorityChip from "../components/PriorityChip";
import EmptyState from "../components/EmptyState";
import TicketSkeleton from "../components/TicketSkeleton";
import { ticketCode, fileUrl } from "../utils";

export default function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/requests?page=0&size=20").then((res) => {
      setRequests(res.data.content || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <div className="toolbar">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <span className="eyebrow">Your Requests</span>
          <h2>My Service Requests</h2>
        </div>
        <Link to="/submit-request" className="btn-small" style={{ background: "var(--ink)" }}>
          <Plus size={15} /> New Request
        </Link>
      </div>

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
          </div>
        </div>
      ))}
    </div>
  );
}
