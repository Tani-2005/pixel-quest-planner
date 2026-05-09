/**
 * Auth sync hook — no-op stub.
 *
 * The app currently uses local zustand state for auth. When a real backend
 * is wired in, hydrate the store from the session here.
 */
export function useAuthSync() {
  // intentionally empty
}
