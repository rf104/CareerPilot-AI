"use client";

import { useEffect, useRef } from "react";

const TESTIMONIALS = [
  {
    id: "testimonial-1",
    name: "Sarah Chen",
    role: "Software Engineer → Senior Engineer at Google",
    avatar: "SC",
    avatarColor: "from-violet-600 to-cyan-500",
    quote:
      "CareerPilot AI helped me identify 8 skills I was missing for senior roles. Within 3 months of following the roadmap, I landed at Google with a 40% salary increase. The resume analysis alone saved me weeks of guessing.",
    stars: 5,
    badge: "🎉 Got the Offer",
  },
  {
    id: "testimonial-2",
    name: "Marcus Johnson",
    role: "Marketing Manager → Product Manager at Stripe",
    avatar: "MJ",
    avatarColor: "from-cyan-600 to-emerald-500",
    quote:
      "The AI job matching is incredibly accurate. It told me I was only a 62% match for PM roles and exactly what was holding me back. Three months later — Stripe. I can't recommend this enough.",
    stars: 5,
    badge: "🚀 Career Switch",
  },
  {
    id: "testimonial-3",
    name: "Priya Patel",
    role: "Data Analyst → Data Scientist at Netflix",
    avatar: "PP",
    avatarColor: "from-amber-500 to-pink-500",
    quote:
      "The interview prep feature is a game-changer. I practiced with AI-generated questions specific to Netflix's data science interviews. I walked in confident and got an offer on the spot.",
    stars: 5,
    badge: "⭐ Dream Job",
  },
];

function StarRating({ stars }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: stars }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" className="text-amber-400">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
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
      id="testimonials"
      ref={sectionRef}
      className="relative py-28 bg-[#020817] overflow-hidden"
    >
      <div
        className="orb w-[500px] h-[500px] top-0 right-[-100px] opacity-10"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <div className="badge w-fit mx-auto mb-6">💬 Success Stories</div>
          <h2
            className="font-display text-4xl sm:text-5xl font-800 text-white mb-6"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
          >
            Real People.{" "}
            <span className="gradient-text">Real Results.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Join thousands of professionals who have already leveled up their
            careers with CareerPilot AI.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              id={t.id}
              className="testimonial-card flex flex-col gap-5 reveal"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Stars + Badge */}
              <div className="flex items-center justify-between">
                <StarRating stars={t.stars} />
                <span
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{
                    background: "rgba(30,41,59,0.8)",
                    border: "1px solid rgba(100,116,139,0.3)",
                    color: "#94a3b8",
                  }}
                >
                  {t.badge}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-slate-300 text-sm leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 mt-auto pt-3 border-t border-slate-800">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white text-sm font-700 flex-shrink-0`}
                  style={{ fontWeight: 700 }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 reveal">
          {["Google", "Stripe", "Netflix", "Meta", "Amazon", "Microsoft"].map(
            (company) => (
              <span
                key={company}
                className="text-slate-600 text-sm font-semibold tracking-wider uppercase hover:text-slate-400 transition-colors"
              >
                {company}
              </span>
            )
          )}
        </div>
        <p className="text-center text-slate-600 text-xs mt-4 reveal">
          Our users have landed offers at top companies
        </p>
      </div>
    </section>
  );
}
