import { redirect } from "@tanstack/react-router";

/**
 * Route guard for protected routes (local/mock auth).
 *
 * Reads the persisted zustand store from localStorage and checks the
 * `authed` flag. Backend integration can replace this later.
 */
export function requireAuth() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("pixelquest-store");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.state?.authed) return;
    }
  } catch {
    // fall through to redirect
  }
  throw redirect({ to: "/login" });
}
