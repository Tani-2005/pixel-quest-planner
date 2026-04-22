import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PixelButton } from "@/components/PixelButton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password — PixelQuest" }] }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background pixel-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/login" className="font-pixel text-[10px] text-pixel-cyan mb-6 inline-block">
          ← Back to Login
        </Link>
        <div className="bg-pixel-surface border-2 border-pixel-gold shadow-pixel-gold p-8">
          <h1 className="font-pixel text-lg text-pixel-gold text-center">Lost the Key?</h1>
          <p className="font-pixel text-[8px] text-muted-foreground text-center mt-2">
            We&apos;ll send you a magic link
          </p>

          {sent ? (
            <div className="mt-8 space-y-4">
              <div className="font-pixel text-[8px] text-pixel-cyan border-2 border-pixel-cyan p-3 text-center">
                ✉ Check your email for a reset link.
              </div>
              <Link to="/login" className="block">
                <PixelButton variant="cyan" className="w-full" size="lg">
                  Back to Login
                </PixelButton>
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-5">
              <label className="block">
                <div className="font-pixel text-[8px] text-pixel-gold mb-2">Email</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="hero@quest.com"
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
                {loading ? "..." : "✉ Send Reset Link"}
              </PixelButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
