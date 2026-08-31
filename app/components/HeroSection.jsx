"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const STATS = [
  { value: "50K+", label: "Resumes Analyzed" },
  { value: "98%", label: "Match Accuracy" },
  { value: "3x", label: "Faster Job Search" },
];

export default function HeroSection() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 100);
    }
  }, []);

  return (
    <section className="relative min-h-screen mesh-gradient grid-overlay flex items-center pt-24 pb-16 overflow-hidden">
      {/* Glow orbs */}
      <div
        className="orb w-[600px] h-[600px] top-[-200px] left-[-200px] opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 70%)",
        }}
      />
      <div
        className="orb w-[500px] h-[500px] bottom-[-150px] right-[-150px] opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.5) 0%, transparent 70%)",
        }}
      />
      <div
        className="orb w-[300px] h-[300px] top-[40%] right-[20%] opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 w-full">
        <div
          ref={heroRef}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left: Copy */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div className="badge w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
              </span>
              AI-Powered Career Platform
            </div>

            {/* Headline */}
            <h1
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-800 leading-tight tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
            >
              <span className="text-white">Stop Guessing.</span>
              <br />
              <span className="gradient-text-hero">Start Applying</span>
              <br />
              <span className="text-white">Smarter.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-lg">
              Upload your resume, match it against job descriptions, discover
              missing skills, track every application, and ace your interviews —
              all powered by AI.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {[
                "📄 Resume Analysis",
                "🎯 AI Job Matching",
                "🔍 Skill Gap Analysis",
                "📊 Application Tracking",
                "🎤 Interview Prep",
              ].map((feat) => (
                <span
                  key={feat}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300"
                  style={{
                    background: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid rgba(100, 116, 139, 0.3)",
                  }}
                >
                  {feat}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                id="hero-get-started-btn"
                className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
              <a
                href="#how-it-works"
                id="hero-watch-demo-btn"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-ghost text-base px-7 py-3.5 inline-flex items-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="opacity-80"
                >
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                See How It Works
              </a>
            </div>

            {/* Mini stats */}
            <div className="flex flex-wrap gap-8 pt-2">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span
                    className="stat-number text-2xl"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-slate-500 text-xs mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Floating stat badges */}
            <div
              className="floating-badge absolute -top-6 -left-4 z-10 text-sm text-slate-200 flex items-center gap-2"
              style={{ animationDelay: "0s" }}
            >
              <span className="text-green-400 text-lg">✓</span>
              <span>Resume Score: <strong className="text-violet-400">85/100</strong></span>
            </div>
            <div
              className="floating-badge absolute -bottom-4 -left-2 z-10 text-sm text-slate-200 flex items-center gap-2"
              style={{ animationDelay: "1.5s" }}
            >
              <span className="text-cyan-400 text-lg">🎯</span>
              <span><strong className="text-cyan-400">94%</strong> Job Match Found</span>
            </div>
            <div
              className="floating-badge absolute top-1/3 -right-6 z-10 text-sm text-slate-200 flex items-center gap-2"
              style={{ animationDelay: "3s" }}
            >
              <span className="text-amber-400">⚡</span>
              <span><strong className="text-amber-400">12</strong> Skills to Add</span>
            </div>

            {/* Dashboard image */}
            <div className="gradient-border">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 0 80px rgba(124,58,237,0.25), 0 40px 120px rgba(0,0,0,0.5)",
                }}
              >
                <Image
                  src="/dashboard-preview.jpg"
                  alt="CareerPilot AI Dashboard Preview"
                  width={680}
                  height={450}
                  className="block w-full"
                  priority
                />
                {/* Overlay shimmer */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,58,237,0.05) 0%, transparent 50%, rgba(6,182,212,0.05) 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <div className="flex flex-col items-center gap-2 opacity-40 animate-bounce">
            <span className="text-xs text-slate-500 tracking-widest uppercase">
              Scroll
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-500"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
