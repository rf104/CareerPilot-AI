"use client";

import { useState, useEffect, useCallback } from "react";
import { getUser, setUser, clearUser, DEFAULT_USER } from "./mockData";

/**
 * Custom hook for authentication state management.
 * Uses localStorage to persist auth state.
 * Replace the mock logic with real API calls when backend is ready.
 */
export function useAuth() {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = getUser();
    if (stored) {
      setUserState(stored);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));

    // Mock validation — accept any non-empty credentials
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const mockUser = {
      ...DEFAULT_USER,
      email,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    };

    setUser(mockUser);
    setUserState(mockUser);
    return mockUser;
  }, []);

  const register = useCallback(async (name, email, password) => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));

    if (!name || !email || !password) {
      throw new Error("All fields are required.");
    }

    const mockUser = {
      ...DEFAULT_USER,
      id: `usr_${Date.now()}`,
      name,
      email,
      joinedAt: new Date().toISOString(),
    };

    setUser(mockUser);
    setUserState(mockUser);
    return mockUser;
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUserState(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUserState((prev) => {
      const updated = { ...prev, ...updates };
      setUser(updated);
      return updated;
    });
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };
}
