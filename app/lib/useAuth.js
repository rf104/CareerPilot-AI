"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "./supabase/client";
import { clearLocalData } from "./mockData";

// Map a Supabase user to the shape the UI expects.
function toAppUser(u) {
  if (!u) return null;
  const meta = u.user_metadata || {};
  return {
    id: u.id,
    email: u.email,
    name: meta.full_name || meta.name || (u.email ? u.email.split("@")[0] : "User"),
    avatar: meta.avatar_url || null,
    joinedAt: u.created_at,
  };
}

const friendly = (error) => {
  const msg = error?.message || "Something went wrong.";
  if (/invalid login credentials/i.test(msg)) return "Incorrect email or password.";
  if (/email not confirmed/i.test(msg)) return "Please confirm your email before signing in.";
  return msg;
};

/** Authentication hook backed by Supabase Auth. */
export function useAuth() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserState(toAppUser(data.user));
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserState(toAppUser(session?.user));
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const login = useCallback(
    async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(friendly(error));
      return toAppUser(data.user);
    },
    [supabase]
  );

  // Returns { needsConfirmation } — true when email confirmation is required.
  const register = useCallback(
    async (name, email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw new Error(friendly(error));
      // Existing confirmed emails return a user with no identities (anti-enumeration).
      if (data.user && data.user.identities?.length === 0) {
        throw new Error("An account with this email already exists.");
      }
      return { user: toAppUser(data.user), needsConfirmation: !data.session };
    },
    [supabase]
  );

  const loginWithProvider = useCallback(
    async (provider) => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw new Error(friendly(error));
    },
    [supabase]
  );

  const sendPasswordReset = useCallback(
    async (email) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) throw new Error(friendly(error));
    },
    [supabase]
  );

  const updatePassword = useCallback(
    async (newPassword) => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(friendly(error));
    },
    [supabase]
  );

  // Verifies the current password before allowing a change.
  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      const { data } = await supabase.auth.getUser();
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: data.user?.email,
        password: currentPassword,
      });
      if (verifyError) throw new Error("Current password is incorrect.");
      await updatePassword(newPassword);
    },
    [supabase, updatePassword]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    clearLocalData();
    setUserState(null);
    window.location.href = "/login";
  }, [supabase]);

  const updateProfile = useCallback(
    async ({ name, email }) => {
      const attrs = {};
      if (name !== undefined) attrs.data = { full_name: name };
      if (email !== undefined && email !== user?.email) attrs.email = email;
      const { data, error } = await supabase.auth.updateUser(attrs);
      if (error) throw new Error(friendly(error));
      setUserState(toAppUser(data.user));
      return { emailChangePending: !!attrs.email };
    },
    [supabase, user]
  );

  const deleteAccount = useCallback(async () => {
    const res = await fetch("/api/account/delete", { method: "POST" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Could not delete account.");
    }
    clearLocalData();
    window.location.href = "/register";
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    loginWithProvider,
    sendPasswordReset,
    updatePassword,
    changePassword,
    logout,
    updateProfile,
    deleteAccount,
  };
}
