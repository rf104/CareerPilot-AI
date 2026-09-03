"use client";

import { useState, useEffect } from "react";
import {
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  APPLICATION_STATUSES,
  STATUS_COLORS,
} from "../../lib/mockData";

const EMPTY_FORM = {
  company: "",
  position: "",
  description: "",
  location: "",
  url: "",
  dateApplied: new Date().toISOString().split("T")[0],
  status: "Wishlist",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // "table" | "cards"
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setApplications(getApplications());
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filtered & searched applications
  const filtered = applications.filter((app) => {
    const matchStatus = filter === "All" || app.status === filter;
    const matchSearch =
      !searchQuery ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Open add modal
  const openAddModal = () => {
    setEditingApp(null);
    setFormData(EMPTY_FORM);
    setModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (app) => {
    setEditingApp(app);
    setFormData({
      company: app.company,
      position: app.position,
      description: app.description || "",
      location: app.location || "",
      url: app.url || "",
      dateApplied: app.dateApplied,
      status: app.status,
    });
    setModalOpen(true);
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingApp) {
      const updated = updateApplication(editingApp.id, formData);
      setApplications(updated);
      showToast("Application updated successfully!");
    } else {
      const updated = addApplication(formData);
      setApplications(updated);
      showToast("Application added successfully!");
    }
    setModalOpen(false);
  };

  // Delete
  const handleDelete = (id) => {
    const updated = deleteApplication(id);
    setApplications(updated);
    setConfirmDelete(null);
    showToast("Application deleted.");
  };

  // Status counts
  const statusCounts = { All: applications.length };
  APPLICATION_STATUSES.forEach((s) => {
    statusCounts[s] = applications.filter((a) => a.status === s).length;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1
            className="section-title text-2xl sm:text-3xl"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
          >
            Applications
          </h1>
          <p className="section-subtitle mt-1">
            {applications.length} total application{applications.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          id="add-application-btn"
          onClick={openAddModal}
          className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2 w-fit"
        >
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Application
          </span>
        </button>
      </div>

      {/* Filter + Search + View toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        {/* Status filters */}
        <div className="flex flex-wrap gap-2 flex-1">
          {["All", ...APPLICATION_STATUSES].map((status) => {
            const isActive = filter === status;
            const colors = STATUS_COLORS[status] || { bg: "rgba(100,116,139,0.15)", text: "#94a3b8", border: "rgba(100,116,139,0.3)" };
            return (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isActive
                    ? "border-violet-500/40 bg-violet-500/15 text-violet-300"
                    : "border-slate-700/30 bg-slate-800/20 text-slate-500 hover:text-slate-300 hover:border-slate-600/40"
                }`}
              >
                {status}
                <span className="ml-1.5 opacity-60">{statusCounts[status] || 0}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/30 w-full sm:w-56">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder-slate-600 w-full"
          />
        </div>

        {/* View toggle */}
        <div className="tab-group flex-shrink-0">
          <button
            onClick={() => setViewMode("table")}
            className={`tab-btn ${viewMode === "table" ? "tab-btn-active" : ""}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`tab-btn ${viewMode === "cards" ? "tab-btn-active" : ""}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="empty-state glass-card">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          <p className="text-slate-500 mb-1 font-medium">No applications found</p>
          <p className="text-slate-600 text-sm mb-4">
            {filter !== "All" ? `No ${filter} applications.` : "Start tracking your job search."}
          </p>
          <button onClick={openAddModal} className="btn-primary text-sm px-5 py-2">
            <span>Add your first application</span>
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="glass-card overflow-hidden" style={{ padding: 0, borderRadius: 16 }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/30">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const colors = STATUS_COLORS[app.status] || STATUS_COLORS.Applied;
                  return (
                    <tr key={app.id} className="border-b border-slate-700/15 last:border-b-0 hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${colors.bg}, rgba(15,23,42,0.8))`,
                              color: colors.text,
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            {app.company[0]}
                          </div>
                          <span className="font-medium text-white">{app.company}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">{app.position}</td>
                      <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">{app.location || "—"}</td>
                      <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">
                        {new Date(app.dateApplied).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="status-badge"
                          style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEditModal(app)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                            title="Edit"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setConfirmDelete(app.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD VIEW */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((app) => {
            const colors = STATUS_COLORS[app.status] || STATUS_COLORS.Applied;
            return (
              <div key={app.id} className="glass-card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${colors.bg}, rgba(15,23,42,0.8))`,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {app.company[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{app.company}</p>
                      <p className="text-xs text-slate-500">{app.location || "Remote"}</p>
                    </div>
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
                  >
                    {app.status}
                  </span>
                </div>

                <p className="text-sm text-slate-300 font-medium">{app.position}</p>

                {app.description && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {app.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-700/20">
                  <span className="text-xs text-slate-600">
                    {new Date(app.dateApplied).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <div className="flex gap-1">
                    {app.url && (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                        title="Open job URL"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                    <button
                      onClick={() => openEditModal(app)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setConfirmDelete(app.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-white mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
              {editingApp ? "Edit Application" : "Add Application"}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Company */}
              <div>
                <label htmlFor="app-company" className="form-label">Company Name *</label>
                <input
                  id="app-company"
                  className="form-input"
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>

              {/* Position */}
              <div>
                <label htmlFor="app-position" className="form-label">Job Position *</label>
                <input
                  id="app-position"
                  className="form-input"
                  placeholder="e.g. Frontend Engineer"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="app-description" className="form-label">Job Description</label>
                <textarea
                  id="app-description"
                  className="form-input form-textarea"
                  placeholder="Paste the job description here..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Location + URL row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="app-location" className="form-label">Location</label>
                  <input
                    id="app-location"
                    className="form-input"
                    placeholder="e.g. Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="app-url" className="form-label">Job URL</label>
                  <input
                    id="app-url"
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>
              </div>

              {/* Date + Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="app-date" className="form-label">Application Date *</label>
                  <input
                    id="app-date"
                    type="date"
                    className="form-input"
                    value={formData.dateApplied}
                    onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="app-status" className="form-label">Status *</label>
                  <select
                    id="app-status"
                    className="form-input form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    {APPLICATION_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-ghost text-sm px-5 py-2.5"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-sm px-6 py-2.5">
                  <span>{editingApp ? "Save Changes" : "Add Application"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete(null)}>
          <div className="modal-card confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete Application</h3>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-ghost text-sm px-5 py-2">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)} className="btn-danger text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
