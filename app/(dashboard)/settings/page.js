"use client";

import { useState } from "react";
import { useAuth } from "../../lib/useAuth";

export default function SettingsPage() {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, email });
    showToast("Profile updated successfully!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    // Mock password change
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Password changed successfully!");
  };

  const handleDeleteAccount = () => {
    // Mock delete
    setConfirmDeleteAccount(false);
    logout();
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="section-title text-2xl sm:text-3xl"
          style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
        >
          Settings
        </h1>
        <p className="section-subtitle mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Profile
        </h2>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-violet-500/20">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">Member since {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="settings-name" className="form-label">Full Name</label>
            <input
              id="settings-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="settings-email" className="form-label">Email Address</label>
            <input
              id="settings-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary text-sm px-6 py-2.5">
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Preferences
        </h2>

        <div className="flex flex-col gap-4">
          {/* Dark mode (always on for now) */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/20 border border-slate-700/15">
            <div>
              <p className="text-sm font-medium text-white">Dark Mode</p>
              <p className="text-xs text-slate-500 mt-0.5">Use dark theme throughout the app</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-violet-500 flex items-center p-0.5 cursor-pointer">
              <div className="w-5 h-5 rounded-full bg-white shadow-sm ml-auto transition-all" />
            </div>
          </div>

          {/* Email notifications */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/20 border border-slate-700/15">
            <div>
              <p className="text-sm font-medium text-white">Email Notifications</p>
              <p className="text-xs text-slate-500 mt-0.5">Receive updates about new features</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-slate-600 flex items-center p-0.5 cursor-pointer">
              <div className="w-5 h-5 rounded-full bg-white shadow-sm transition-all" />
            </div>
          </div>

          {/* Application reminders */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/20 border border-slate-700/15">
            <div>
              <p className="text-sm font-medium text-white">Application Reminders</p>
              <p className="text-xs text-slate-500 mt-0.5">Get reminded to follow up on applications</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-violet-500 flex items-center p-0.5 cursor-pointer">
              <div className="w-5 h-5 rounded-full bg-white shadow-sm ml-auto transition-all" />
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <div>
            <label htmlFor="settings-current-password" className="form-label">Current Password</label>
            <input
              id="settings-current-password"
              type="password"
              className="form-input"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="settings-new-password" className="form-label">New Password</label>
            <input
              id="settings-new-password"
              type="password"
              className="form-input"
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="settings-confirm-password" className="form-label">Confirm New Password</label>
            <input
              id="settings-confirm-password"
              type="password"
              className="form-input"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary text-sm px-6 py-2.5">
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-base font-semibold text-red-400 mb-2 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Danger Zone
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Once you delete your account, all data will be permanently removed.
        </p>
        <button
          onClick={() => setConfirmDeleteAccount(true)}
          className="px-5 py-2 text-sm font-medium text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      {confirmDeleteAccount && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteAccount(false)}>
          <div className="modal-card confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-2">Delete Account</h3>
            <p className="text-sm text-slate-400 mb-6">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDeleteAccount(false)} className="btn-ghost text-sm px-5 py-2">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} className="btn-danger text-sm">
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
