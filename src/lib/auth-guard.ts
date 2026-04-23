import { redirect } from "@tanstack/react-router";

/**
 * Route guard for protected routes.
 *
 * Checks for a valid Supabase session in localStorage. The Supabase JS client
 * persists sessions under the key `sb-<project-ref>-auth-token`. We don't
 * call into the supabase client here because `beforeLoad` runs synchronously
 * during SSR and we need to avoid importing the client (which has SSR guards).
 *
 * If no session is found, redirects to /login.
 */
export function requireAuth() {
  if (typeof window === "undefined") return;
  try {
    const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;
    // Try the canonical Supabase session key first
    const candidates: string[] = [];
    if (projectRef) candidates.push(`sb-${projectRef}-auth-token`);
    // Fallback: scan all keys (covers older Supabase clients / multi-project)
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("sb-") && k.endsWith("-auth-token") && !candidates.includes(k)) {
        candidates.push(k);
      }
    }
    for (const key of candidates) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const parsed = JSON.parse(raw);
        const token = parsed?.access_token ?? parsed?.currentSession?.access_token;
        const expiresAt: number | undefined =
          parsed?.expires_at ?? parsed?.currentSession?.expires_at;
        if (token && (!expiresAt || expiresAt * 1000 > Date.now() - 60_000)) {
          return; // valid session
        }
      } catch {
        // ignore unparseable entries
      }
    }
  } catch {
    // localStorage unavailable — fall through to redirect
  }
  throw redirect({ to: "/login" });
}
