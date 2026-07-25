import { useEffect, useState } from "react";
import { MapPin, Calendar, Inbox, PackageSearch, AlertCircle } from "lucide-react";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import PriorityChip from "../components/PriorityChip";
import EmptyState from "../components/EmptyState";
import TicketSkeleton from "../components/TicketSkeleton";
import { ticketCode } from "../utils";

const NEXT_STATUS = {
  ASSIGNED: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
};

export default function OfficerDashboard() {
  const [tab, setTab] = useState("assigned"); // "assigned" | "available"
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    Promise.all([
      api.get("/requests?page=0&size=20"),
      api.get("/requests/available?page=0&size=20"),
    ]).then(([assignedRes, availableRes]) => {
      setAssignedRequests(assignedRes.data.content || []);
      setAvailableRequests(availableRes.data.content || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const advanceStatus = async (req) => {
    const nextStatus = NEXT_STATUS[req.status];
    if (!nextStatus) return;
    setBusyId(req.id);
    try {
      await api.put(`/requests/${req.id}/status`, {
        status: nextStatus,
        comment: `Marked as ${nextStatus} by maintenance officer`,
      });
      load();
    } finally {
      setBusyId(null);
    }
  };

  const claim = async (req) => {
    setBusyId(req.id);
    setError("");
    try {
      await api.put(`/requests/${req.id}/claim`);
      load();
      setTab("assigned");
    } catch (err) {
      setError(err.response?.data?.message || "Could not claim this request — it may already be taken.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <span className="eyebrow">Field Work</span>
        <h2>Officer Dashboard</h2>
      </div>

      <div className="tab-group" style={{ marginBottom: 20 }}>
        <button className={`tab-btn ${tab === "assigned" ? "active" : ""}`} onClick={() => setTab("assigned")}>
          <Inbox size={15} /> Assigned to Me ({assignedRequests.length})
        </button>
        <button className={`tab-btn ${tab === "available" ? "active" : ""}`} onClick={() => setTab("available")}>
          <PackageSearch size={15} /> Available in My Category ({availableRequests.length})
        </button>
      </div>

      {error && <div className="error-msg"><AlertCircle size={16} />{error}</div>}
      {loading && <TicketSkeleton count={3} />}

      {!loading && tab === "assigned" && (
        assignedRequests.length === 0 ? (
          <EmptyState icon={Inbox} title="Nothing assigned yet" description="Requests the admin assigns to you will show up here." />
        ) : (
          assignedRequests.map((r) => (
            <div key={r.id} className={`ticket priority-${r.priority}`}>
              <div className="ticket-main">
                <div className="ticket-code">{ticketCode(r.id)}</div>
                <div className="ticket-title">{r.title}</div>
                <div className="ticket-meta">
                  <span><MapPin size={13} /> {r.location}</span>
                  <PriorityChip priority={r.priority} />
                </div>
              </div>
              <div className="ticket-actions">
                <StatusBadge status={r.status} />
                {NEXT_STATUS[r.status] && (
                  <button
                    className="btn-small"
                    style={{ background: "var(--success)" }}
                    disabled={busyId === r.id}
                    onClick={() => advanceStatus(r)}
                  >
                    Mark {NEXT_STATUS[r.status].replace("_", " ")}
                  </button>
                )}
              </div>
            </div>
          ))
        )
      )}

      {!loading && tab === "available" && (
        availableRequests.length === 0 ? (
          <EmptyState icon={PackageSearch} title="Queue is clear" description="No unclaimed requests in your category right now." />
        ) : (
          availableRequests.map((r) => (
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
                <button
                  className="btn-small"
                  style={{ background: "var(--blueprint)" }}
                  disabled={busyId === r.id}
                  onClick={() => claim(r)}
                >
                  Claim
                </button>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}
