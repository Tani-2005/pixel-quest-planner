import { createFileRoute } from "@tanstack/react-router";
import { HUD } from "@/components/HUD";
import { useGame, BADGES } from "@/lib/store";

export const Route = createFileRoute("/badges")({
  head: () => ({ meta: [{ title: "Badges — PixelQuest" }] }),
  component: BadgesPage,
});

function BadgesPage() {
  const badges = useGame((s) => s.badges);
  const isUnlocked = (k: string) => badges.find((b) => b.key === k);

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20">
      <HUD />
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <h1 className="font-pixel text-base md:text-lg text-pixel-cyan">Badge Collection</h1>
        <p className="font-pixel text-[8px] text-muted-foreground mt-2">
          {badges.length} / {BADGES.length} unlocked
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
          {BADGES.map((b) => {
            const got = isUnlocked(b.key);
            return (
              <div
                key={b.key}
                className={`p-5 text-center border-2 ${
                  got
                    ? "bg-pixel-surface border-pixel-gold shadow-pixel-gold"
                    : "bg-[oklch(0.20_0.04_290)] border-pixel-purple opacity-70"
                }`}
              >
                <div className={`text-5xl mb-3 ${got ? "" : "grayscale opacity-40"}`}>
                  {got ? b.emoji : "❓"}
                </div>
                <div
                  className={`font-pixel text-[10px] ${got ? "text-pixel-gold" : "text-muted-foreground"}`}
                >
                  {got ? b.name : "???"}
                </div>
                <div className="font-pixel text-[7px] text-muted-foreground mt-2 leading-relaxed">
                  {got ? b.desc : "???"}
                </div>
              </div>
            );
          })}
        </div>

        {badges.length === 0 && (
          <p className="font-pixel text-[10px] text-muted-foreground text-center mt-10">
            🔒 No badges yet. Complete tasks to unlock achievements!
          </p>
        )}
      </main>
    </div>
  );
}
