"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/useAuth";

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-card p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-800 text-white mb-2"
            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
          >
            Reset Password
          </h1>
          <p className="text-slate-400 text-sm">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg text-sm text-red-400 bg-red-500/10 border border-red-500/20">
            {error}
          </div>
        )}

        {sent ? (
          <div className="p-3 rounded-lg text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            If an account exists for {email}, a reset link is on its way. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="forgot-email" className="form-label">
                Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Sending..." : "Send Reset Link"}</span>
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-400 mt-8">
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
