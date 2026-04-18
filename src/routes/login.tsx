import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PixelButton } from "@/components/PixelButton";
import { useGame } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login — PixelQuest" }],
  }),
  component: Login,
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useGame((s) => s.login);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username || "Player");
    navigate({ to: "/dashboard" });
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

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block">
              <div className="font-pixel text-[8px] text-pixel-cyan mb-2">Username</div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="pixel_hero"
                className="w-full bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-3 font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-pixel-pink"
              />
            </label>
            <label className="block">
              <div className="font-pixel text-[8px] text-pixel-cyan mb-2">Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-3 font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-pixel-pink"
              />
            </label>

            <PixelButton type="submit" variant="cyan" className="w-full" size="lg">
              ▶ Continue
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
