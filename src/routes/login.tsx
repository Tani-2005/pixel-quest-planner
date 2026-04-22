import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PixelButton } from "@/components/PixelButton";
import { useGame } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login — PixelQuest" }],
  }),
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const login = useGame((s) => s.login);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    const handle =
      (data.user?.user_metadata?.username as string | undefined) ||
      data.user?.email?.split("@")[0] ||
      "Player";
    login(handle);
    navigate({ to: "/dashboard" });
  };

  const google = async () => {
    setError(null);
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/dashboard`,
    });
    if (result.error) {
      setError(result.error.message ?? "Google sign-in failed");
      setLoading(false);
      return;
    }
    if (!("redirected" in result) || !result.redirected) {
      // session set in popup mode
      const { data } = await supabase.auth.getUser();
      const handle =
        (data.user?.user_metadata?.full_name as string | undefined) ||
        data.user?.email?.split("@")[0] ||
        "Player";
      login(handle);
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen bg-background pixel-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="font-pixel text-[10px] text-pixel-cyan mb-6 inline-block">
          ← Back
        </Link>
        <div className="bg-pixel-surface border-2 border-pixel-cyan shadow-pixel-cyan p-8">
          <h1 className="font-pixel text-lg text-pixel-cyan text-center">Welcome Back</h1>
          <p className="font-pixel text-[8px] text-muted-foreground text-center mt-2">
            Resume your quest
          </p>

          <button
            type="button"
            onClick={google}
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-3 bg-white text-[#1f1f1f] font-sans font-medium py-3 border-2 border-pixel-purple hover:bg-white/90 transition-colors disabled:opacity-60"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-pixel-purple/40" />
            <span className="font-pixel text-[7px] text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-pixel-purple/40" />
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="block">
              <div className="font-pixel text-[8px] text-pixel-cyan mb-2">Email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hero@quest.com"
                required
                className="w-full bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-3 font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-pixel-pink"
              />
            </label>
            <label className="block">
              <div className="flex items-center justify-between mb-2">
                <span className="font-pixel text-[8px] text-pixel-cyan">Password</span>
                <Link
                  to="/forgot-password"
                  className="font-pixel text-[8px] text-pixel-pink hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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
              variant="cyan"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "..." : "▶ Continue"}
            </PixelButton>
          </form>

          <p className="font-pixel text-[8px] text-muted-foreground text-center mt-6">
            New here?{" "}
            <Link to="/signup" className="text-pixel-pink">
              Start Quest
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.71-1.57 2.7-3.9 2.7-6.61z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.71A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
