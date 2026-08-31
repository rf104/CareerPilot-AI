"use client";

import { useEffect, useRef } from "react";

const FEATURES = [
  {
    id: "resume-analysis",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Resume Analysis",
    description:
      "Get an instant AI-powered resume score. Our engine evaluates structure, keywords, impact statements, and ATS compatibility — then gives you actionable improvement suggestions.",
    color: "from-violet-600/20 to-violet-500/5",
    accent: "#a78bfa",
    tag: "AI Scoring",
  },
  {
    id: "ai-job-matching",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <path d="M8 11h6M11 8v6" />
      </svg>
    ),
    title: "AI Job Matching",
    description:
      "Paste any job description and our semantic AI instantly calculates how well your profile matches — with a percentage score and detailed breakdown of what aligns.",
    color: "from-cyan-600/20 to-cyan-500/5",
    accent: "#22d3ee",
    tag: "Semantic AI",
  },
  {
    id: "skill-gap-analysis",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Skill Gap Analysis",
    description:
      "Discover exactly which skills you're missing for your target roles. Get a personalized learning roadmap with recommended resources to bridge the gap fast.",
    color: "from-amber-600/20 to-amber-500/5",
    accent: "#fbbf24",
    tag: "Gap Detection",
  },
  {
    id: "application-tracking",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 17h7M17.5 14v6" />
      </svg>
    ),
    title: "Application Tracking",
    description:
      "Manage every application in a visual Kanban board. Track status from Applied → Interview → Offer. Never lose track of a promising opportunity again.",
    color: "from-green-600/20 to-green-500/5",
    accent: "#34d399",
    tag: "Kanban Board",
  },
  {
    id: "ai-interview-prep",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
    title: "AI Interview Prep",
    description:
      "Practice with AI-generated questions tailored to your target role. Get real-time feedback on your answers, body language cues, and confidence tips.",
    color: "from-pink-600/20 to-pink-500/5",
    accent: "#f472b6",
    tag: "Mock Interviews",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020817 0%, #0a0f1e 50%, #020817 100%)" }}
    >
      {/* Background accent */}
      <div
        className="orb w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.8) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 reveal">
          <div className="badge w-fit mx-auto mb-6">✨ Platform Features</div>
          <h2
            className="font-display text-4xl sm:text-5xl font-800 text-white mb-6"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
          >
            Everything You Need to{" "}
            <span className="gradient-text">Land the Job</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            CareerPilot AI brings together five powerful tools in one seamless
            platform — designed to give you an unfair advantage in today&apos;s
            competitive job market.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.id}
              id={`feature-card-${feature.id}`}
              className={`glass-card p-7 flex flex-col gap-5 reveal ${
                i === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Icon */}
              <div className="feature-icon-wrap" style={{ color: feature.accent }}>
                {feature.icon}
              </div>

              {/* Tag */}
              <span
                className="text-xs font-600 tracking-wider uppercase"
                style={{ color: feature.accent, fontWeight: 600 }}
              >
                {feature.tag}
              </span>

              {/* Title */}
              <h3
                className="text-xl font-700 text-white"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Learn more */}
              <div className="mt-auto pt-2">
                <a
                  href={`#${feature.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200"
                  style={{ color: feature.accent }}
                >
                  Learn more
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
