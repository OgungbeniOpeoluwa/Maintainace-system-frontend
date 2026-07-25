import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardPlus, MapPin, Tag, Gauge, FileText, Camera, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import api from "../api/axios";

export default function SubmitRequest() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    location: "",
    priority: "MEDIUM",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("request", new Blob([JSON.stringify(form)], { type: "application/json" }));
      if (image) formData.append("image", image);

      await api.post("/requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Request submitted! Redirecting to your ticket list...");
      setTimeout(() => navigate("/my-requests"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <span className="eyebrow">New Work Order</span>
        <h2 style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ClipboardPlus size={26} /> Submit a Service Request
        </h2>
        <p>Describe the issue clearly — it goes straight into the queue for your selected category.</p>
      </div>

      <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
        {error && <div className="error-msg"><AlertCircle size={16} />{error}</div>}
        {success && <div className="success-msg"><CheckCircle2 size={16} />{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FileText size={14} /> Title</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Broken window in Room 12" />
          </div>
          <div className="form-group">
            <label><Tag size={14} /> Category</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label><MapPin size={14} /> Location</label>
            <input name="location" value={form.location} onChange={handleChange} required placeholder="e.g. Hostel Block C, Room 12" />
          </div>
          <div className="form-group">
            <label><Gauge size={14} /> Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="form-group">
            <label><FileText size={14} /> Description</label>
            <textarea name="description" rows="4" value={form.description} onChange={handleChange} placeholder="Describe the issue in detail" />
          </div>
          <div className="form-group">
            <label><Camera size={14} /> Evidence Photo <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <button className="btn-primary" disabled={loading}>
            {loading ? "Submitting..." : <>Submit Request <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
