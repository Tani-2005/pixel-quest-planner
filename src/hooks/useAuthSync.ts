import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useGame } from "@/lib/store";

/**
 * Bridges Supabase auth state into the local zustand store.
 *
 * - On mount, hydrates the store from the current Supabase session.
 *   This is essential after OAuth redirects (e.g. Google) where the
 *   session is created by Supabase but the store hasn't been told yet.
 * - Subscribes to auth state changes so login/logout in any tab keeps
 *   the store in sync.
 */
export function useAuthSync() {
  useEffect(() => {
    let cancelled = false;

    const handleSession = (
      session: { user?: { user_metadata?: Record<string, unknown>; email?: string | null } } | null,
    ) => {
      if (cancelled) return;
      const state = useGame.getState();
      if (session?.user) {
        const meta = session.user.user_metadata ?? {};
        const handle =
          (meta.username as string | undefined) ||
          (meta.full_name as string | undefined) ||
          (meta.name as string | undefined) ||
          session.user.email?.split("@")[0] ||
          "Player";
        if (!state.authed || state.user.username !== handle) {
          state.login(handle);
        }
      } else if (state.authed) {
        state.logout();
      }
    };

    // Set up the listener BEFORE getting the current session (avoids races)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    supabase.auth.getSession().then(({ data }) => handleSession(data.session));

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);
}
