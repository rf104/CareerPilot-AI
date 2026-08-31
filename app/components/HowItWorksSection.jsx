"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    number: "01",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    title: "Upload Resume",
    description:
      "Drag & drop your resume PDF or paste your LinkedIn profile. Our AI instantly parses and structures your experience, skills, and education.",
    color: "#a78bfa",
    bg: "rgba(124,58,237,0.1)",
    border: "rgba(124,58,237,0.3)",
  },
  {
    number: "02",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Add Job Description",
    description:
      "Paste the job listing or enter the company and role. CareerPilot AI fetches and processes the requirements in seconds.",
    color: "#22d3ee",
    bg: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.3)",
  },
  {
    number: "03",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: "AI Analysis",
    description:
      "Our AI runs a deep semantic comparison — matching skills, experience, keywords, and cultural fit. It identifies gaps and strengths in real time.",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.3)",
  },
  {
    number: "04",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Get Personalized Insights",
    description:
      "Receive a tailored action plan: skills to learn, resume edits to make, interview questions to prepare, and jobs to prioritize. Land faster.",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.3)",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 150);
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
      id="how-it-works"
      ref={sectionRef}
      className="relative py-28 overflow-hidden bg-[#020817]"
    >
      {/* Side accents */}
      <div
        className="orb w-[400px] h-[400px] top-0 right-0 opacity-10"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)" }}
      />
      <div
        className="orb w-[400px] h-[400px] bottom-0 left-0 opacity-10"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.8) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 reveal">
          <div className="badge w-fit mx-auto mb-6">🔄 Simple Process</div>
          <h2
            className="font-display text-4xl sm:text-5xl font-800 text-white mb-6"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
          >
            How <span className="gradient-text">CareerPilot AI</span> Works
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Go from confused to confident in four simple steps. Our AI does the
            heavy lifting so you can focus on what matters — landing the job.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop connector line */}
          <div
            className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), rgba(6,182,212,0.5), transparent)",
            }}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.number} className="reveal flex flex-col items-center text-center" style={{ transitionDelay: `${i * 150}ms` }}>
                {/* Step circle */}
                <div
                  className="relative mb-6 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    background: step.bg,
                    border: `1px solid ${step.border}`,
                    color: step.color,
                    boxShadow: `0 0 30px ${step.bg}`,
                  }}
                >
                  {step.icon}
                  {/* Step number badge */}
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-700 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}cc, ${step.color}88)`,
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {step.number.replace("0", "")}
                  </div>
                </div>

                {/* Content */}
                <div
                  className="glass-card p-6 w-full flex flex-col items-center gap-3"
                  style={{ borderColor: `${step.border}` }}
                >
                  <h3
                    className="text-lg font-700 text-white"
                    style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile arrow connector */}
                {i < STEPS.length - 1 && (
                  <div className="lg:hidden mt-4 mb-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA below steps */}
        <div className="text-center mt-16 reveal">
          <p className="text-slate-400 mb-6 text-lg">
            Ready to try it yourself?
          </p>
          <a
            href="/register"
            id="how-it-works-cta-btn"
            className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3.5"
          >
            <span>Start Your Analysis — It&apos;s Free</span>
          </a>
        </div>
      </div>
    </section>
  );
}
