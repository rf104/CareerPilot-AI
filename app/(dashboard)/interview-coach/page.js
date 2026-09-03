"use client";

export default function InterviewCoachPage() {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      ),
      title: "AI-Generated Questions",
      description: "Get role-specific interview questions tailored to your target position and resume profile.",
      color: "#a78bfa",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: "Real-Time Feedback",
      description: "Submit your answers and receive instant AI feedback on content, structure, and delivery.",
      color: "#22d3ee",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      title: "Score Tracking",
      description: "Track your improvement over time with detailed scoring across multiple interview sessions.",
      color: "#4ade80",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: "Strength & Weakness Analysis",
      description: "Understand exactly where you shine and where you need improvement with detailed breakdowns.",
      color: "#fbbf24",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        {/* Coming Soon badge */}
        <div className="badge w-fit mx-auto mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          Coming in V2
        </div>

        <h1
          className="text-3xl sm:text-4xl font-800 text-white mb-4"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        >
          Interview Coach
          <span className="gradient-text"> AI</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Practice with AI-generated questions tailored to your target role. Get real-time feedback,
          track your scores, and walk into every interview with confidence.
        </p>
      </div>

      {/* Preview Mockup */}
      <div className="glass-card p-6 sm:p-8 mb-10 relative overflow-hidden">
        {/* Blur overlay */}
        <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p className="text-white font-semibold text-lg">Coming Soon</p>
            <p className="text-slate-400 text-sm">We&apos;re building something amazing</p>
          </div>
        </div>

        {/* Mock interview UI */}
        <div className="opacity-60">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-violet-500/15 flex items-center justify-center text-violet-400 text-xs font-bold">Q1</div>
            <div>
              <p className="text-sm text-slate-400">Question 1 of 10</p>
              <p className="text-xs text-slate-600">Full-Stack Developer • Behavioral</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/20 mb-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              &quot;Tell me about a time you had to debug a complex production issue under pressure.
              How did you approach it, and what was the outcome?&quot;
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/20 border border-slate-700/15 mb-4">
            <p className="text-xs text-slate-600 mb-2">Your answer:</p>
            <div className="h-20 skeleton rounded-lg" />
          </div>

          <div className="flex justify-end">
            <div className="skeleton h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {features.map((feature) => (
          <div key={feature.title} className="glass-card p-5 flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `${feature.color}15`,
                color: feature.color,
                border: `1px solid ${feature.color}30`,
              }}
            >
              {feature.icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notify Me */}
      <div className="text-center">
        <button
          id="interview-coach-notify-btn"
          className="btn-primary text-sm px-8 py-3"
          onClick={() => {
            const btn = document.getElementById("interview-coach-notify-btn");
            if (btn) {
              btn.textContent = "✓ We'll notify you!";
              btn.disabled = true;
              btn.style.opacity = "0.7";
            }
          }}
        >
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Notify Me When Ready
          </span>
        </button>
        <p className="text-xs text-slate-600 mt-3">
          Be the first to know when Interview Coach launches.
        </p>
      </div>
    </div>
  );
}
