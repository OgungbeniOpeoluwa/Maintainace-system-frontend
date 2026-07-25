import { useEffect, useState } from "react";
import { X, Clock } from "lucide-react";
import api from "../api/axios";
import StatusBadge from "./StatusBadge";

export default function HistoryModal({ requestId, requestTitle, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/requests/${requestId}/logs`)
      .then((res) => setLogs(res.data || []))
      .finally(() => setLoading(false));
  }, [requestId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={18} /> Request History
          </h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 0 }}>{requestTitle}</p>

        {loading && <p style={{ color: "var(--text-muted)" }}>Loading history...</p>}

        {!loading && logs.length === 0 && (
          <p style={{ color: "var(--text-muted)" }}>No history recorded for this request yet.</p>
        )}

        {!loading && logs.length > 0 && (
          <div className="timeline">
            {logs.map((log, i) => (
              <div key={log.id || i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <StatusBadge status={log.status} />
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--ink)" }}>
                    <strong>{log.updatedByName || "Unknown"}</strong>
                  </div>
                  {log.comment && (
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>{log.comment}</div>
                  )}
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
