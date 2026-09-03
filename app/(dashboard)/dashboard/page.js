"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/useAuth";
import { getApplications, getResumes, STATUS_COLORS } from "../../lib/mockData";

export default function DashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setApplications(getApplications());
    setResumes(getResumes());
    setMounted(true);
  }, []);

  const interviewCount = applications.filter((a) => a.status === "Interview").length;
  const offerCount = applications.filter((a) => a.status === "Offer").length;
  const recentApps = applications.slice(0, 5);

  const today = new Date();
  const greeting =
    today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      accent: "#a78bfa",
    },
    {
      label: "In Interview",
      value: interviewCount,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      accent: "#c084fc",
    },
    {
      label: "AI Match Score",
      value: "78%",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <path d="M8 11h6M11 8v6" />
        </svg>
      ),
      accent: "#22d3ee",
    },
    {
      label: "Resumes",
      value: resumes.length,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
      accent: "#4ade80",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <h1
          className="text-2xl sm:text-3xl font-800 text-white mb-1"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        >
          {greeting}, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-slate-500 text-sm">{dateStr}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{ "--accent": stat.accent, animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                {stat.label}
              </span>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: `${stat.accent}15`,
                  color: stat.accent,
                }}
              >
                {stat.icon}
              </div>
            </div>
            <div
              className={`text-3xl font-800 ${mounted ? "count-animate" : ""}`}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                color: stat.accent,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="section-title text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          <Link href="/resume" className="quick-action" id="quick-upload-resume">
            <div className="quick-action-icon" style={{ color: "#a78bfa" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            Upload Resume
          </Link>

          <Link href="/applications" className="quick-action" id="quick-add-application">
            <div className="quick-action-icon" style={{ color: "#22d3ee" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </div>
            Add Application
          </Link>

          <Link href="/ai-match" className="quick-action" id="quick-analyze-job">
            <div className="quick-action-icon" style={{ color: "#fbbf24" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            Analyze a Job
          </Link>
        </div>
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title text-lg">Recent Applications</h2>
          <Link
            href="/applications"
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
          >
            View all →
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="empty-state glass-card">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <p className="text-slate-500 mb-1 font-medium">No applications yet</p>
            <p className="text-slate-600 text-sm">Start tracking your job search by adding your first application.</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden" style={{ padding: 0, borderRadius: 16 }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/30">
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApps.map((app, i) => {
                    const colors = STATUS_COLORS[app.status] || STATUS_COLORS.Applied;
                    return (
                      <tr
                        key={app.id}
                        className="border-b border-slate-700/15 last:border-b-0 hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
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
                        <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">
                          {new Date(app.dateApplied).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className="status-badge"
                            style={{
                              background: colors.bg,
                              color: colors.text,
                              borderColor: colors.border,
                            }}
                          >
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Offers highlight (if any) */}
      {offerCount > 0 && (
        <div className="mt-6 p-5 rounded-2xl border border-green-500/20 bg-green-500/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center text-green-400 flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div>
            <p className="text-green-300 font-semibold text-sm">
              🎉 You have {offerCount} offer{offerCount > 1 ? "s" : ""}!
            </p>
            <p className="text-green-400/60 text-xs mt-0.5">
              Congratulations! Check your applications for details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
