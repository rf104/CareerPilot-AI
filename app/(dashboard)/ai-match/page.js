"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getResumes,
  getApplications,
  MOCK_AI_MATCH,
  saveAIResult,
} from "../../lib/mockData";

// Circular progress component
function ProgressRing({ value, size = 140, strokeWidth = 10, color = "#a78bfa" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (value / 100) * circumference);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, circumference]);

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg className="progress-ring" width={size} height={size}>
        <circle
          className="progress-ring-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-800"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color }}
        >
          {value}%
        </span>
        <span className="text-xs text-slate-500">Match</span>
      </div>
    </div>
  );
}

// Breakdown bar component
function BreakdownBar({ label, value, color }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-20 text-right">{label}</span>
      <div className="flex-1 h-2 bg-slate-800/60 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
      <span className="text-xs font-medium w-10" style={{ color }}>{value}%</span>
    </div>
  );
}

export default function AIMatchPage() {
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [jdSource, setJdSource] = useState("saved"); // "saved" | "paste"
  const [selectedJob, setSelectedJob] = useState("");
  const [pastedJD, setPastedJD] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedRec, setExpandedRec] = useState(null);

  useEffect(() => {
    setResumes(getResumes());
    setApplications(getApplications());
  }, []);

  const canAnalyze =
    selectedResume &&
    ((jdSource === "saved" && selectedJob) || (jdSource === "paste" && pastedJD.trim()));

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze) return;

    setAnalyzing(true);
    setResult(null);

    // Simulate AI processing delay (2-4 seconds)
    await new Promise((r) => setTimeout(r, 2500));

    // Use mock result with slight randomization
    const score = MOCK_AI_MATCH.overallScore + Math.floor(Math.random() * 10 - 5);
    const mockResult = {
      ...MOCK_AI_MATCH,
      overallScore: Math.max(40, Math.min(98, score)),
      breakdown: {
        skills: Math.max(40, Math.min(98, MOCK_AI_MATCH.breakdown.skills + Math.floor(Math.random() * 10 - 5))),
        experience: Math.max(40, Math.min(98, MOCK_AI_MATCH.breakdown.experience + Math.floor(Math.random() * 10 - 5))),
        education: Math.max(40, Math.min(98, MOCK_AI_MATCH.breakdown.education + Math.floor(Math.random() * 10 - 5))),
        keywords: Math.max(40, Math.min(98, MOCK_AI_MATCH.breakdown.keywords + Math.floor(Math.random() * 10 - 5))),
      },
      resumeName: resumes.find((r) => r.id === selectedResume)?.filename || "Resume",
      jobTitle: jdSource === "saved"
        ? applications.find((a) => a.id === selectedJob)?.position || "Job"
        : "Custom Job Description",
    };

    saveAIResult(mockResult);
    setResult(mockResult);
    setAnalyzing(false);
  }, [canAnalyze, selectedResume, selectedJob, jdSource, resumes, applications]);

  const getScoreColor = (score) => {
    if (score >= 80) return "#4ade80";
    if (score >= 60) return "#fbbf24";
    return "#f87171";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return { bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "rgba(239,68,68,0.25)" };
      case "Medium": return { bg: "rgba(245,158,11,0.12)", text: "#fbbf24", border: "rgba(245,158,11,0.25)" };
      case "Low": return { bg: "rgba(34,197,94,0.12)", text: "#4ade80", border: "rgba(34,197,94,0.25)" };
      default: return { bg: "rgba(100,116,139,0.12)", text: "#94a3b8", border: "rgba(100,116,139,0.25)" };
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="section-title text-2xl sm:text-3xl"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        >
          AI Match Analysis
        </h1>
        <p className="section-subtitle mt-1">
          Compare your resume against job descriptions to discover your match score
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-card p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Step 1: Select Resume */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">1</div>
              <h3 className="text-sm font-semibold text-white">Select Resume</h3>
            </div>
            <select
              id="ai-match-resume-select"
              className="form-input form-select"
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
            >
              <option value="">Choose a resume...</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>{r.filename}</option>
              ))}
            </select>
            {resumes.length === 0 && (
              <p className="text-xs text-amber-400 mt-2">Upload a resume first to use AI Match.</p>
            )}
          </div>

          {/* Step 2: Job Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">2</div>
              <h3 className="text-sm font-semibold text-white">Job Description</h3>
            </div>

            {/* Source tabs */}
            <div className="tab-group mb-3">
              <button
                onClick={() => setJdSource("saved")}
                className={`tab-btn ${jdSource === "saved" ? "tab-btn-active" : ""}`}
              >
                Saved Job
              </button>
              <button
                onClick={() => setJdSource("paste")}
                className={`tab-btn ${jdSource === "paste" ? "tab-btn-active" : ""}`}
              >
                Paste New
              </button>
            </div>

            {jdSource === "saved" ? (
              <select
                id="ai-match-job-select"
                className="form-input form-select"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <option value="">Choose a saved application...</option>
                {applications.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.company} — {a.position}
                  </option>
                ))}
              </select>
            ) : (
              <textarea
                id="ai-match-jd-textarea"
                className="form-input form-textarea"
                placeholder="Paste the job description here..."
                value={pastedJD}
                onChange={(e) => setPastedJD(e.target.value)}
                rows={4}
              />
            )}
          </div>
        </div>

        {/* Analyze button */}
        <div className="mt-6 flex justify-center">
          <button
            id="ai-match-analyze-btn"
            onClick={handleAnalyze}
            disabled={!canAnalyze || analyzing}
            className="btn-primary text-sm px-8 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              {analyzing ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  Analyze Match
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {analyzing && (
        <div className="glass-card p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full bg-violet-500/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold mb-1">AI is analyzing your match...</p>
              <p className="text-slate-500 text-sm">Comparing skills, experience, and keywords</p>
            </div>
            <div className="flex gap-3 mt-2">
              {["Skills", "Experience", "Education", "Keywords"].map((item, i) => (
                <div key={item} className="skeleton h-6 w-20" style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !analyzing && (
        <div className="flex flex-col gap-6">
          {/* Score + Breakdown Row */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Overall Score */}
            <div className="glass-card p-6 flex flex-col items-center justify-center gap-4">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Profile Similarity</h3>
              <ProgressRing
                value={result.overallScore}
                color={getScoreColor(result.overallScore)}
              />
              <div className="text-center">
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-white">{result.resumeName}</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">vs. {result.jobTitle}</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="glass-card p-6 md:col-span-2">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-5">Category Breakdown</h3>
              <div className="flex flex-col gap-4">
                <BreakdownBar label="Skills" value={result.breakdown.skills} color="#a78bfa" />
                <BreakdownBar label="Experience" value={result.breakdown.experience} color="#22d3ee" />
                <BreakdownBar label="Education" value={result.breakdown.education} color="#4ade80" />
                <BreakdownBar label="Keywords" value={result.breakdown.keywords} color="#fbbf24" />
              </div>
            </div>
          </div>

          {/* Matched + Missing Skills */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Matched Skills
                  <span className="ml-2 text-xs text-green-400 font-normal">({result.matchedSkills.length})</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.map((skill, i) => (
                  <span
                    key={skill}
                    className="skill-tag skill-tag-match"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">
                  Missing Skills
                  <span className="ml-2 text-xs text-red-400 font-normal">({result.missingSkills.length})</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill, i) => (
                  <span
                    key={skill}
                    className="skill-tag skill-tag-missing"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    ✗ {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
            </div>

            <div className="flex flex-col gap-3">
              {result.recommendations.map((rec, i) => {
                const pColor = getPriorityColor(rec.priority);
                const isExpanded = expandedRec === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-700/20 bg-slate-800/20 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedRec(isExpanded ? null : i)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-slate-700/10 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="status-badge"
                          style={{ background: pColor.bg, color: pColor.text, borderColor: pColor.border }}
                        >
                          {rec.priority}
                        </span>
                        <span className="text-sm font-medium text-white truncate">{rec.title}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-slate-500 hidden sm:block">{rec.timeEstimate}</span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#64748b"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                            transition: "transform 0.2s ease",
                          }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-4 pt-0">
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {rec.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span className="text-xs text-slate-500">Estimated time: {rec.timeEstimate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !analyzing && (
        <div className="empty-state glass-card">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <path d="M8 11h6M11 8v6" />
          </svg>
          <p className="text-slate-500 font-medium text-lg mt-2">Ready to analyze</p>
          <p className="text-slate-600 text-sm mt-1">Select a resume and job description above to get started</p>
        </div>
      )}
    </div>
  );
}
