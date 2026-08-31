"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function CTASection() {
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
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #020817 0%, #0a0f1e 50%, #020817 100%)" }}
    >
      {/* Background orbs */}
      <div
        className="orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.6) 0%, transparent 70%)" }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="cta-gradient p-12 sm:p-16 reveal">
          {/* Badge */}
          <div className="badge w-fit mx-auto mb-8">🚀 Start for Free</div>

          {/* Headline */}
          <h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-800 text-white mb-6 leading-tight"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
          >
            Ready to Land Your{" "}
            <span className="gradient-text">Dream Job?</span>
          </h2>

          {/* Subtext */}
          <p className="text-slate-400 text-lg mb-4 max-w-2xl mx-auto leading-relaxed">
            Join over 50,000 professionals using CareerPilot AI to analyze
            resumes, match jobs, and prepare for interviews — with zero
            guesswork.
          </p>

          {/* Features list */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              "✓ Free to get started",
              "✓ No credit card required",
              "✓ Results in seconds",
              "✓ Cancel anytime",
            ].map((item) => (
              <span key={item} className="text-slate-400 text-sm">
                {item}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              id="cta-section-get-started-btn"
              className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
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
            <Link
              href="/login"
              id="cta-section-login-btn"
              className="btn-ghost text-base px-8 py-4 w-full sm:w-auto text-center"
            >
              Already have an account? Login
            </Link>
          </div>

          {/* Social proof micro */}
          <p className="text-slate-600 text-sm mt-8">
            ⭐ Rated 4.9/5 by over 2,000 professionals on Product Hunt
          </p>
        </div>
      </div>
    </section>
  );
}
