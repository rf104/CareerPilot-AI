"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/useAuth";

// Reached via the recovery email → /auth/callback (which creates a session) → here.
export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, loading: authLoading, updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      await updatePassword(password);
      router.replace("/dashboard");
      router.refresh();
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
            New Password
          </h1>
          <p className="text-slate-400 text-sm">Choose a new password for your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg text-sm text-red-400 bg-red-500/10 border border-red-500/20">
            {error}
          </div>
        )}

        {!authLoading && !user ? (
          <div className="p-3 rounded-lg text-sm text-red-400 bg-red-500/10 border border-red-500/20">
            This reset link is invalid or has expired. Please request a new one.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="reset-password" className="form-label">New Password</label>
              <input
                id="reset-password"
                type="password"
                className="form-input"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="reset-confirm" className="form-label">Confirm Password</label>
              <input
                id="reset-confirm"
                type="password"
                className="form-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading || authLoading}
              className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Updating..." : "Update Password"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
