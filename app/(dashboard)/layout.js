"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/useAuth";
import Sidebar from "../components/dashboard/Sidebar";
import TopBar from "../components/dashboard/TopBar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Responsive sidebar
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e) => {
      const desktop = e.matches;
      setIsDesktop(desktop);
      setSidebarCollapsed(!desktop);
    };
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#020817" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full animate-spin"
            style={{ border: "3px solid rgba(139,92,246,0.2)", borderTopColor: "#7c3aed" }}
          />
          <span className="text-slate-500 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const marginLeft = isDesktop ? (sidebarCollapsed ? "72px" : "260px") : "0";

  return (
    <div className="min-h-screen" style={{ background: "#020817" }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div
        className="transition-all duration-300 min-h-screen flex flex-col"
        style={{ marginLeft }}
      >
        <TopBar
          user={user}
          onLogout={logout}
          onMobileMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

