import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PixelButton } from "@/components/PixelButton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — PixelQuest" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase places a recovery token in the URL hash and triggers PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // If the hash is present on first paint, mark ready immediately.
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setReady(true);
    }
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background pixel-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/login" className="font-pixel text-[10px] text-pixel-cyan mb-6 inline-block">
          ← Back
        </Link>
        <div className="bg-pixel-surface border-2 border-pixel-pink shadow-pixel-pink p-8">
          <h1 className="font-pixel text-lg text-pixel-pink text-center">New Password</h1>
          <p className="font-pixel text-[8px] text-muted-foreground text-center mt-2">
            Choose a new master key
          </p>

          {!ready ? (
            <div className="mt-8 font-pixel text-[8px] text-muted-foreground text-center">
              Verifying reset link...
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block">
                <div className="font-pixel text-[8px] text-pixel-pink mb-2">New password</div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-3 font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-pixel-pink"
                />
              </label>
              <label className="block">
                <div className="font-pixel text-[8px] text-pixel-pink mb-2">Confirm</div>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-3 font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-pixel-pink"
                />
              </label>

              {error && (
                <div className="font-pixel text-[8px] text-pixel-red border-2 border-pixel-red p-2">
                  {error}
                </div>
              )}

              <PixelButton
                type="submit"
                variant="accent"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? "..." : "✓ Update Password"}
              </PixelButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
