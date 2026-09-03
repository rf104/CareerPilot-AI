import Link from "next/link";

export const metadata = {
  title: "CareerPilot AI — Sign In",
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen auth-mesh grid-overlay flex flex-col">
      {/* Glow orbs */}
      <div
        className="orb w-[500px] h-[500px] top-[-150px] left-[-150px] opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.5) 0%, transparent 70%)",
        }}
      />
      <div
        className="orb w-[400px] h-[400px] bottom-[-100px] right-[-100px] opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)",
        }}
      />

      {/* Top logo bar */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2.5 group w-fit">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow duration-300">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
            </svg>
          </div>
          <span
            className="font-display font-700 text-xl tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
          >
            <span className="text-white">Career</span>
            <span className="gradient-text">Pilot AI</span>
          </span>
        </Link>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        {children}
      </div>
    </div>
  );
}
