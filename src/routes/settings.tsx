import { createFileRoute, Link } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth-guard";
import { HUD } from "@/components/HUD";
import { PixelButton } from "@/components/PixelButton";
import { PetEvolution } from "@/components/PetEvolution";
import { useGame, AccentTheme, PetHat } from "@/lib/store";
import { sfx, setMuted } from "@/lib/sound";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — PixelQuest" }] }),
  beforeLoad: requireAuth,
  component: SettingsPage,
});

const HATS: { key: PetHat; emoji: string; label: string }[] = [
  { key: "none", emoji: "—", label: "None" },
  { key: "crown", emoji: "👑", label: "Crown" },
  { key: "wizard", emoji: "🧙‍♂️", label: "Wizard" },
  { key: "cap", emoji: "🧢", label: "Cap" },
  { key: "halo", emoji: "😇", label: "Halo" },
];

const ACCENTS: { key: AccentTheme; label: string; cls: string }[] = [
  { key: "pink", label: "Pink", cls: "bg-pixel-pink" },
  { key: "cyan", label: "Cyan", cls: "bg-pixel-cyan" },
  { key: "gold", label: "Gold", cls: "bg-pixel-gold" },
  { key: "green", label: "Green", cls: "bg-pixel-green" },
];

function SettingsPage() {
  const { user, setPetName, setPetHat, setAccent, setSoundEnabled, resetDemo } = useGame();

  const toggleSound = () => {
    const next = !user.sound_enabled;
    setSoundEnabled(next);
    setMuted(!next);
    if (next) setTimeout(() => sfx.click(), 50);
  };

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-8">
      <HUD />
      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-6">
        <div>
          <h1 className="font-pixel text-base md:text-lg text-pixel-cyan">Settings</h1>
          <p className="font-pixel text-[8px] text-muted-foreground mt-2">
            Customize your pet, theme, and sounds
          </p>
        </div>

        {/* Pet customization */}
        <section className="bg-pixel-surface border-2 border-pixel-pink shadow-pixel-pink p-6">
          <h2 className="font-pixel text-xs text-pixel-cyan mb-4">Pet Customization</h2>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple p-4">
              <PetEvolution level={user.level} totalXp={user.total_xp} />
            </div>
            <div className="space-y-5">
              <label className="block">
                <div className="font-pixel text-[8px] text-pixel-cyan mb-2">Pet Name</div>
                <input
                  value={user.pet_name}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Pixel"
                  maxLength={20}
                  className="w-full bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-3 font-sans text-foreground focus:outline-none focus:border-pixel-pink"
                />
              </label>

              <div>
                <div className="font-pixel text-[8px] text-pixel-cyan mb-2">Accessory</div>
                <div className="grid grid-cols-5 gap-2">
                  {HATS.map((h) => (
                    <button
                      key={h.key}
                      onClick={() => {
                        setPetHat(h.key);
                        sfx.click();
                      }}
                      className={`font-pixel text-[7px] py-3 border-2 ${
                        user.pet_hat === h.key
                          ? "bg-pixel-pink text-white border-pixel-purple"
                          : "border-pixel-purple text-muted-foreground"
                      }`}
                      title={h.label}
                    >
                      <div className="text-lg leading-none">{h.emoji}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accent theme */}
        <section className="bg-pixel-surface border-2 border-pixel-cyan shadow-pixel-cyan p-6">
          <h2 className="font-pixel text-xs text-pixel-cyan mb-4">Accent Color</h2>
          <div className="grid grid-cols-4 gap-3">
            {ACCENTS.map((a) => (
              <button
                key={a.key}
                onClick={() => {
                  setAccent(a.key);
                  sfx.click();
                }}
                className={`p-4 border-2 ${
                  user.accent === a.key
                    ? "border-white shadow-pixel"
                    : "border-pixel-purple"
                }`}
              >
                <div className={`${a.cls} h-8 border-2 border-pixel-purple`} />
                <div className="font-pixel text-[8px] mt-2">{a.label}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Sound */}
        <section className="bg-pixel-surface border-2 border-pixel-gold shadow-pixel-gold p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-pixel text-xs text-pixel-gold">Sound Effects</h2>
            <p className="font-pixel text-[8px] text-muted-foreground mt-2">
              Chiptune chimes for actions, level-ups, and Pomodoro phase changes
            </p>
          </div>
          <PixelButton variant={user.sound_enabled ? "accent" : "ghost"} onClick={toggleSound}>
            {user.sound_enabled ? "🔊 ON" : "🔇 OFF"}
          </PixelButton>
        </section>

        {/* Shortcuts */}
        <section className="bg-pixel-surface border-2 border-pixel-purple p-6">
          <h2 className="font-pixel text-xs text-pixel-cyan mb-4">Keyboard Shortcuts</h2>
          <div className="grid sm:grid-cols-2 gap-2 font-pixel text-[8px]">
            {[
              ["G", "Dashboard"],
              ["T", "Tasks"],
              ["S", "Study Room"],
              ["B", "Badges"],
              [",", "Settings"],
              ["N", "New Quest (in Tasks)"],
            ].map(([k, label]) => (
              <div key={k} className="flex items-center justify-between bg-[oklch(0.14_0.06_295)] border border-pixel-purple px-3 py-2">
                <span className="text-muted-foreground">{label}</span>
                <kbd className="bg-pixel-purple text-white px-2 py-0.5">{k}</kbd>
              </div>
            ))}
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-pixel-surface border-2 border-pixel-red p-6">
          <h2 className="font-pixel text-xs text-pixel-red mb-3">Danger Zone</h2>
          <p className="font-pixel text-[8px] text-muted-foreground mb-4">
            Reset all progress, tasks, and badges. Cannot be undone.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/dashboard">
              <PixelButton variant="ghost">← Back</PixelButton>
            </Link>
            <PixelButton
              variant="ghost"
              onClick={() => {
                if (confirm("Reset all PixelQuest progress?")) {
                  resetDemo();
                  window.location.href = "/";
                }
              }}
            >
              💥 Reset Demo
            </PixelButton>
          </div>
        </section>
      </main>
    </div>
  );
}
