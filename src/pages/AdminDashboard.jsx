import { useEffect, useState } from "react";
import {
  ClipboardList, Users, BarChart3, UserCog, Download,
  CheckCircle2, AlertCircle, PackageOpen,
} from "lucide-react";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { fileUrl } from "../utils";

export default function AdminDashboard() {
  const [tab, setTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState({});

  const load = () => {
    setLoading(true);
    const query = statusFilter ? `&status=${statusFilter}` : "";
    Promise.all([
      api.get(`/requests?page=0&size=50${query}`),
      api.get("/admin/officers"),
      api.get("/categories"),
    ]).then(([reqRes, offRes, catRes]) => {
      setRequests(reqRes.data.content || []);
      setOfficers(offRes.data || []);
      setCategories(catRes.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleAssign = async (requestId) => {
    const officerId = assigning[requestId];
    if (!officerId) return;
    await api.put(`/requests/${requestId}/assign`, { officerId });
    load();
  };

  const categoryName = (id) => categories.find((c) => c.id === id)?.name || id;

  const TABS = [
    { key: "requests", label: "All Requests", icon: ClipboardList },
    { key: "officers", label: "Manage Officers", icon: UserCog },
    { key: "users", label: "All Users", icon: Users },
    { key: "reports", label: "Reports", icon: BarChart3 },
  ];

  return (
    <div className="container">
      <div className="page-header">
        <span className="eyebrow">Control Center</span>
        <h2>Admin Dashboard</h2>
      </div>

      <div className="tab-group" style={{ marginBottom: 24 }}>
        {TABS.map((t) => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "requests" && (
        <RequestsTab
          requests={requests}
          officers={officers}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          loading={loading}
          assigning={assigning}
          setAssigning={setAssigning}
          handleAssign={handleAssign}
        />
      )}

      {tab === "officers" && (
        <OfficersTab officers={officers} categories={categories} categoryName={categoryName} onCreated={load} />
      )}

      {tab === "users" && <UsersTab />}

      {tab === "reports" && <ReportsTab />}
    </div>
  );
}

function RequestsTab({ requests, officers, statusFilter, setStatusFilter, loading, assigning, setAssigning, handleAssign }) {
  return (
    <>
      <div className="toolbar">
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>All Service Requests</h3>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: "1.5px solid var(--line)" }}>
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading && <p style={{ color: "var(--text-muted)" }}>Loading...</p>}
      {!loading && requests.length === 0 && (
        <EmptyState icon={PackageOpen} title="No requests found" description="Try a different status filter, or check back once students submit requests." />
      )}

      {!loading && requests.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Evidence</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assign to Officer</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>
                    {r.imageUrl ? (
                      <a href={fileUrl(r.imageUrl)} target="_blank" rel="noreferrer">
                        <img src={fileUrl(r.imageUrl)} alt="Evidence" className="table-thumb" />
                      </a>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>
                    )}
                  </td>
                  <td>{r.location}</td>
                  <td>{r.priority}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <select
                        value={assigning[r.id] || r.assignedTo || ""}
                        onChange={(e) => setAssigning({ ...assigning, [r.id]: e.target.value })}
                        style={{ padding: "6px 8px", borderRadius: 6, border: "1.5px solid var(--line)" }}
                      >
                        <option value="">Select officer</option>
                        {officers.map((o) => (
                          <option key={o.id} value={o.id}>{o.fullName}</option>
                        ))}
                      </select>
                      <button className="btn-small" style={{ background: "var(--blueprint)" }} onClick={() => handleAssign(r.id)}>
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function OfficersTab({ officers, categories, categoryName, onCreated }) {
  const [form, setForm] = useState({ fullName: "", email: "", categoryIds: [] });
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleCategory = (id) => {
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((c) => c !== id)
        : [...f.categoryIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (form.categoryIds.length === 0) {
      setError("Select at least one category for this officer.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/admin/officers", form);
      setResult(data);
      setForm({ fullName: "", email: "", categoryIds: [] });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create officer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ maxWidth: 560 }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}><UserCog size={20} /> Create Maintenance Officer</h3>
        {error && <div className="error-msg"><AlertCircle size={16} />{error}</div>}
        {result && (
          <div className="success-msg" style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={16} /> Officer <strong>{result.officer.fullName}</strong> created.
            </span>
            {result.emailSent ? (
              <span>A welcome email with login credentials was sent.</span>
            ) : (
              <span>
                Email could not be sent — share these credentials manually:{" "}
                <strong>{result.officer.email}</strong> / <strong>{result.temporaryPassword}</strong>
              </span>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Category Specialization(s)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
              {categories.map((c) => {
                const checked = form.categoryIds.includes(c.id);
                return (
                  <label key={c.id} className={`chip-checkbox ${checked ? "checked" : ""}`}>
                    <input type="checkbox" checked={checked} onChange={() => toggleCategory(c.id)} />
                    {c.name}
                  </label>
                );
              })}
            </div>
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Officer & Send Credentials"}
          </button>
        </form>
      </div>

      <h3 style={{ marginTop: 28, marginBottom: 12 }}>Existing Officers</h3>
      {officers.length === 0 ? (
        <EmptyState icon={UserCog} title="No officers yet" description="Create one above to start assigning work orders." />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Categories</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {officers.map((o) => (
                <tr key={o.id}>
                  <td>{o.fullName}</td>
                  <td>{o.email}</td>
                  <td>{(o.categoryIds || []).map(categoryName).join(", ")}</td>
                  <td>{o.mustChangePassword ? "Awaiting first login" : "Active"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = roleFilter ? `?role=${roleFilter}` : "";
    api.get(`/admin/users${query}`)
      .then((res) => setUsers(res.data || []))
      .finally(() => setLoading(false));
  }, [roleFilter]);

  return (
    <div>
      <div className="toolbar">
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>All Users</h3>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: 6, border: "1.5px solid var(--line)" }}>
          <option value="">All roles</option>
          <option value="STUDENT_STAFF">Student / Staff</option>
          <option value="OFFICER">Maintenance Officer</option>
          <option value="ADMIN">Administrator</option>
        </select>
      </div>

      {loading && <p style={{ color: "var(--text-muted)" }}>Loading...</p>}
      {!loading && users.length === 0 && (
        <EmptyState icon={Users} title="No users found" description="Try a different role filter." />
      )}

      {!loading && users.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role.replace("_", " / ")}</td>
                  <td>{u.department || "—"}</td>
                  <td>{u.active ? "Active" : "Deactivated"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ReportsTab() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api.get("/admin/reports/summary")
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get("/admin/reports/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "service_requests_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <p style={{ color: "var(--text-muted)" }}>Loading report...</p>;
  if (!summary) return <p style={{ color: "var(--text-muted)" }}>Could not load report.</p>;

  const statusColors = {
    PENDING: "var(--warning)",
    ASSIGNED: "var(--info)",
    IN_PROGRESS: "var(--blueprint-dark)",
    COMPLETED: "var(--success)",
    REJECTED: "var(--danger)",
  };

  const maxStatusCount = Math.max(1, ...Object.values(summary.byStatus || {}));
  const maxCategoryCount = Math.max(1, ...Object.values(summary.byCategory || {}));

  return (
    <div>
      <div className="toolbar">
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Reports</h3>
        <button className="btn-small" style={{ background: "var(--success)" }} onClick={handleExport} disabled={exporting}>
          <Download size={15} /> {exporting ? "Exporting..." : "Export All Requests as CSV"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 26 }}>
        <SummaryCard label="Total Requests" value={summary.totalRequests} color="var(--blueprint)" />
        <SummaryCard label="Total Users" value={summary.totalUsers} color="var(--ink)" />
        <SummaryCard label="Students / Staff" value={summary.totalStudents} color="var(--info)" />
        <SummaryCard label="Officers" value={summary.totalOfficers} color="var(--amber-dark)" />
        <SummaryCard label="Admins" value={summary.totalAdmins} color="var(--success)" />
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div className="card" style={{ flex: "1 1 300px" }}>
          <h4 style={{ marginTop: 0 }}>Requests by Status</h4>
          {Object.entries(summary.byStatus || {}).map(([status, count]) => (
            <div key={status} className="bar-row">
              <div className="bar-label">
                <StatusBadge status={status} />
                <strong>{count}</strong>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(count / maxStatusCount) * 100}%`, background: statusColors[status] || "var(--blueprint)" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ flex: "1 1 300px" }}>
          <h4 style={{ marginTop: 0 }}>Requests by Category</h4>
          {Object.entries(summary.byCategory || {}).map(([category, count]) => (
            <div key={category} className="bar-row">
              <div className="bar-label">
                <span>{category}</span>
                <strong>{count}</strong>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${(count / maxCategoryCount) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
