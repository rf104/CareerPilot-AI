"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 50000, display: "50K+", label: "Resumes Analyzed", suffix: "+", icon: "📄" },
  { value: 98, display: "98%", label: "AI Match Accuracy", suffix: "%", icon: "🎯" },
  { value: 12000, display: "12K+", label: "Jobs Successfully Matched", suffix: "+", icon: "💼" },
  { value: 3, display: "3x", label: "Faster Job Search", suffix: "x", icon: "⚡" },
];

function useCountUp(target, duration = 2000, started = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, started]);

  return count;
}

function StatCard({ stat, started, index }) {
  const count = useCountUp(stat.value, 2000 + index * 200, started);
  const displayCount =
    stat.value >= 10000 ? `${Math.floor(count / 1000)}K${stat.suffix}` :
    stat.value >= 1000 ? `${Math.floor(count / 1000)}K${stat.suffix}` :
    `${count}${stat.suffix}`;

  return (
    <div
      id={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
      className="glass-card p-8 flex flex-col items-center text-center gap-3 reveal"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <span className="text-4xl">{stat.icon}</span>
      <div className="stat-number text-5xl">{started ? displayCount : "0"}</div>
      <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #020817 0%, #0a0f1e 50%, #020817 100%)",
      }}
    >
      {/* Gradient accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(6,182,212,0.5), transparent)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), rgba(6,182,212,0.3), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <h2
            className="font-display text-3xl sm:text-4xl font-800 text-white"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
          >
            Trusted by{" "}
            <span className="gradient-text">Thousands of Job Seekers</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} started={started} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
