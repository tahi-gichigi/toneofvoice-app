"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";
import { identify as mpIdentify } from "@/lib/mixpanel";
import mixpanel from "mixpanel-browser";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const setDone = () => {
      if (!cancelled) setLoading(false);
    };

    try {
      const supabase = createClient();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!cancelled) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

      supabase.auth.getUser().then(({ data }) => {
        if (!cancelled) {
          setUser(data?.user ?? null);
          setLoading(false);
        }
      }).catch((err) => {
        console.error("[AuthProvider] getUser failed:", err);
        setDone();
      });

      // Safety: stop spinner if auth check hangs (e.g. network/Supabase slow)
      const timeout = setTimeout(setDone, 2500);

      return () => {
        cancelled = true;
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error("[AuthProvider] init failed:", err);
      setDone();
    }
  }, []);

  // Identify user in Mixpanel once both auth and Mixpanel are ready.
  // Delayed slightly so MixpanelProvider's useEffect (init) runs first.
  React.useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      mpIdentify(user.id, { $email: user.email });

      // Self-exclusion: suppress analytics for internal team emails.
      // Sets a localStorage flag so MixpanelProvider can also suppress on next page load.
      const internalEmails = (process.env.NEXT_PUBLIC_INTERNAL_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const userEmail = user.email?.toLowerCase() ?? "";
      if (internalEmails.length > 0 && internalEmails.includes(userEmail)) {
        localStorage.setItem("mp_internal_user", "true");
        try {
          // Drop all subsequent events client-side; never reach Mixpanel servers
          mixpanel.register({ $ignore: true });
          mixpanel.stop_session_recording();
        } catch {
          // Mixpanel may not be initialised (e.g. dev mode) - safe to ignore
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [user]);

  const signOut = React.useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, signOut }),
    [user, loading, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
