import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { HUD } from "@/components/HUD";
import { useGame, petStage, BADGES, levelFromXp } from "@/lib/store";
import { PixelButton } from "@/components/PixelButton";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — PixelQuest" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("pixelquest-store");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (!parsed?.state?.authed) throw redirect({ to: "/login" });
        } catch (e) {
          if (e && typeof e === "object" && "to" in e) throw e;
        }
      } else {
        throw redirect({ to: "/login" });
      }
    }
  },
  component: Dashboard,
});

function Dashboard() {
  const { user, tasks, badges, completeTask } = useGame();
  const pet = petStage(user.level);

  const upcoming = tasks
    .filter((t) => t.status !== "Done")
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 3);

  const doneCount = tasks.filter((t) => t.status === "Done").length;

  // pet evolution progress
  const xpToNext = pet.next === 999 ? 100 : (pet.next - pet.min) * 100;
  const xpFromStage = user.total_xp - (pet.min - 1) * 100;
  const evoPct = pet.next === 999 ? 100 : Math.min(100, (xpFromStage / xpToNext) * 100);

  const recentBadges = [...badges]
    .sort((a, b) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-0">
      <HUD />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-8">
        <div>
          <h2 className="font-pixel text-base md:text-xl text-pixel-cyan">
            Welcome back, {user.username}
          </h2>
          <p className="font-pixel text-[8px] text-muted-foreground mt-2">
            {pet.stage} · {pet.name}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's quests */}
          <section className="lg:col-span-2 bg-pixel-surface border-2 border-pixel-purple shadow-pixel p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-pixel text-xs text-pixel-pink">Today&apos;s Quests</h3>
              <Link to="/tasks">
                <PixelButton variant="ghost" size="sm">
                  All →
                </PixelButton>
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-3">🗺️</div>
                <p className="font-pixel text-[10px] text-muted-foreground">
                  No quests found, hero. Add your first mission!
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((t) => {
                  const overdue = new Date(t.due_date).getTime() < Date.now();
                  return (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-3 bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple p-3"
                    >
                      <div className="min-w-0">
                        <div className="font-sans font-medium text-sm truncate">{t.title}</div>
                        <div className="font-pixel text-[8px] text-muted-foreground mt-1">
                          {t.subject} ·{" "}
                          <span className={overdue ? "text-pixel-red" : ""}>
                            {overdue ? "Overdue" : new Date(t.due_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-pixel text-[8px] text-pixel-gold">
                          +{t.xp_reward}
                        </span>
                        <PixelButton
                          variant="cyan"
                          size="sm"
                          onClick={() => completeTask(t.id)}
                        >
                          ✓
                        </PixelButton>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Pet companion */}
          <section className="bg-pixel-surface border-2 border-pixel-pink shadow-pixel-pink p-6">
            <h3 className="font-pixel text-xs text-pixel-cyan mb-5">Pixel Companion</h3>
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                {pet.emoji}
              </motion.div>
              <div className="font-pixel text-sm text-pixel-pink">{pet.name}</div>
              <div className="font-pixel text-[8px] text-muted-foreground mt-1">{pet.stage}</div>
              <div className="mt-5">
                <div className="flex justify-between font-pixel text-[8px] text-muted-foreground mb-1">
                  <span>Evolution</span>
                  <span>{Math.floor(evoPct)}%</span>
                </div>
                <div className="h-3 bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${evoPct}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-pixel-gold"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Stat label="Total XP" value={user.total_xp} accent="cyan" />
          <Stat label="Level" value={levelFromXp(user.total_xp)} accent="pink" />
          <Stat label="Tasks Done" value={doneCount} accent="gold" />
          <Stat label="Streak 🔥" value={user.streak_count} accent="purple" />
        </div>

        {/* Recent badges */}
        <section className="bg-pixel-surface border-2 border-pixel-gold shadow-pixel-gold p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-pixel text-xs text-pixel-gold">Recent Badges</h3>
            <Link to="/badges">
              <PixelButton variant="ghost" size="sm">
                All →
              </PixelButton>
            </Link>
          </div>
          {recentBadges.length === 0 ? (
            <p className="font-pixel text-[10px] text-muted-foreground text-center py-6">
              🔒 No badges yet. Complete tasks to unlock achievements!
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {recentBadges.map((b) => {
                const meta = BADGES.find((x) => x.key === b.key)!;
                return (
                  <div
                    key={b.key}
                    className="bg-[oklch(0.14_0.06_295)] border-2 border-pixel-gold p-3 text-center min-w-[100px]"
                  >
                    <div className="text-3xl">{meta.emoji}</div>
                    <div className="font-pixel text-[8px] text-pixel-gold mt-2">{meta.name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: "purple" | "pink" | "cyan" | "gold";
}) {
  const map = {
    purple: "border-pixel-purple shadow-pixel text-pixel-purple",
    pink: "border-pixel-pink shadow-pixel-pink text-pixel-pink",
    cyan: "border-pixel-cyan shadow-pixel-cyan text-pixel-cyan",
    gold: "border-pixel-gold shadow-pixel-gold text-pixel-gold",
  };
  const [borderShadow, textColor] = [map[accent], map[accent].split(" ").pop()!];
  return (
    <div className={`bg-pixel-surface border-2 p-4 ${borderShadow}`}>
      <div className="font-pixel text-[8px] text-muted-foreground">{label}</div>
      <div className={`font-pixel text-2xl mt-2 ${textColor}`}>{value}</div>
    </div>
  );
}
