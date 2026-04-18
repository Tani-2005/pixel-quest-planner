import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PixelButton } from "@/components/PixelButton";
import { useGame } from "@/lib/store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Sign up — PixelQuest" }],
  }),
  component: Signup,
});

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useGame((s) => s.login);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    login(username);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background pixel-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="font-pixel text-[10px] text-pixel-cyan mb-6 inline-block">
          ← Back
        </Link>
        <div className="bg-pixel-surface border-2 border-pixel-pink shadow-pixel-pink p-8">
          <h1 className="font-pixel text-lg text-pixel-cyan text-center">New Player</h1>
          <p className="font-pixel text-[8px] text-muted-foreground text-center mt-2">
            Choose your hero name
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <Field
              label="Username"
              value={username}
              onChange={setUsername}
              placeholder="pixel_hero"
              required
            />
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="hero@quest.com"
            />
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />

            <PixelButton type="submit" variant="accent" className="w-full" size="lg">
              ▶ Start Quest
            </PixelButton>
          </form>

          <p className="font-pixel text-[8px] text-muted-foreground text-center mt-6">
            Already a hero?{" "}
            <Link to="/login" className="text-pixel-cyan">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="font-pixel text-[8px] text-pixel-cyan mb-2">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-3 font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-pixel-pink"
      />
    </label>
  );
}
