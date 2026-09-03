"use client";

import { useState, useEffect, useRef } from "react";
import {
  getResumes,
  addResume,
  deleteResume,
  SEED_RESUME,
} from "../../lib/mockData";

// Mock skills data for newly uploaded resumes
const MOCK_UPLOAD_SKILLS = [
  "JavaScript", "React", "HTML/CSS", "Node.js", "Git",
  "TypeScript", "REST APIs", "SQL", "Python", "Agile",
];

export default function ResumePage() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loaded = getResumes();
    setResumes(loaded);
    if (loaded.length > 0) setSelectedResume(loaded[0]);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      showToast("Please upload a PDF file.", "error");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 150));
      setUploadProgress(i);
    }

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 500));

    const newResume = {
      filename: file.name,
      fileSize: `${(file.size / 1024).toFixed(0)} KB`,
      skills: MOCK_UPLOAD_SKILLS,
      extractedText: `Resume content extracted from ${file.name}.\n\nThis is a mock extraction. When the backend is connected, the actual PDF text will be parsed and displayed here.\n\nDetected sections: Summary, Experience, Education, Skills, Projects.`,
      sections: {
        summary: "Extracted summary will appear here when backend is connected.",
        experience: [
          { title: "Developer", company: "Tech Company", period: "2023 – Present", location: "Remote" },
        ],
        education: [
          { degree: "B.S. Computer Science", school: "University", year: "2023" },
        ],
      },
    };

    const { updated, newResume: created } = addResume(newResume);
    setResumes(updated);
    setSelectedResume(created);
    setUploading(false);
    setUploadProgress(0);
    showToast("Resume uploaded and processed successfully!");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  const handleDeleteResume = (id) => {
    const updated = deleteResume(id);
    setResumes(updated);
    if (selectedResume?.id === id) {
      setSelectedResume(updated[0] || null);
    }
    setConfirmDelete(null);
    showToast("Resume deleted.");
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title text-2xl sm:text-3xl" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
          Resume Manager
        </h1>
        <p className="section-subtitle mt-1">Upload, manage, and review your resumes</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Upload + Resume List */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Upload Zone */}
          <div
            className={`drop-zone ${dragActive ? "drop-zone-active" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files[0])}
            />

            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
                </svg>
                <p className="text-violet-400 font-medium text-sm">Processing resume...</p>
                <div className="w-full max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${uploadProgress}%`,
                      background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                    }}
                  />
                </div>
                <span className="text-xs text-slate-500">{uploadProgress}%</span>
              </div>
            ) : (
              <>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-slate-300 font-medium text-sm mb-1">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-slate-600 text-xs">Supports PDF files only</p>
              </>
            )}
          </div>

          {/* Resume List */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
              Your Resumes ({resumes.length})
            </h3>
            <div className="flex flex-col gap-2">
              {resumes.map((resume) => (
                <button
                  key={resume.id}
                  onClick={() => setSelectedResume(resume)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedResume?.id === resume.id
                      ? "bg-violet-500/10 border-violet-500/30"
                      : "bg-slate-800/30 border-slate-700/20 hover:border-slate-600/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{resume.filename}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {resume.fileSize} • {new Date(resume.uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(resume.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                      aria-label="Delete resume"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </button>
              ))}

              {resumes.length === 0 && (
                <p className="text-sm text-slate-600 text-center py-6">
                  No resumes uploaded yet. Upload your first PDF above.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Resume Detail */}
        <div className="lg:col-span-2">
          {selectedResume ? (
            <div className="flex flex-col gap-6">
              {/* Detected Skills */}
              <div className="glass-card p-6">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Detected Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedResume.skills.map((skill) => (
                    <span key={skill} className="skill-tag skill-tag-neutral">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Parsed Sections */}
              {selectedResume.sections && (
                <div className="glass-card p-6">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                    Parsed Sections
                  </h3>

                  {/* Summary */}
                  {selectedResume.sections.summary && (
                    <div className="mb-5">
                      <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Summary</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">{selectedResume.sections.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {selectedResume.sections.experience?.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Experience</h4>
                      <div className="flex flex-col gap-3">
                        {selectedResume.sections.experience.map((exp, i) => (
                          <div key={i} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
                            <p className="text-sm font-medium text-white">{exp.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {exp.company} • {exp.period} • {exp.location}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {selectedResume.sections.education?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Education</h4>
                      <div className="flex flex-col gap-3">
                        {selectedResume.sections.education.map((edu, i) => (
                          <div key={i} className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/20">
                            <p className="text-sm font-medium text-white">{edu.degree}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {edu.school} • {edu.year}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Extracted Text */}
              <div className="glass-card p-6">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Extracted Text
                </h3>
                <pre className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans bg-slate-800/30 rounded-lg p-4 max-h-96 overflow-y-auto border border-slate-700/20">
                  {selectedResume.extractedText}
                </pre>
              </div>
            </div>
          ) : (
            <div className="empty-state glass-card h-full min-h-[400px]">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-slate-500 font-medium text-lg">No resume selected</p>
              <p className="text-slate-600 text-sm mt-1">Upload a PDF or select a resume from the list</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete(null)}>
          <div className="modal-card confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete Resume</h3>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="btn-ghost text-sm px-5 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteResume(confirmDelete)}
                className="btn-danger text-sm"
              >
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
