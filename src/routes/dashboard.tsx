import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { HUD } from "@/components/HUD";
import { useGame, petStage, levelFromXp } from "@/lib/store";
import { PetEvolution } from "@/components/PetEvolution";
import { QuestsPanel } from "@/components/dashboard/QuestsPanel";
import { RecentBadgesPanel } from "@/components/dashboard/RecentBadgesPanel";
import { DailyGoalPanel } from "@/components/dashboard/DailyGoalPanel";
import { Stat } from "@/components/dashboard/Stat";
import { ToastStack } from "@/components/PixelToast";
import { CompletionBurst } from "@/components/CompletionBurst";
import { LevelUpOverlay } from "@/components/LevelUpOverlay";
import { useGameFeedback } from "@/hooks/useGameFeedback";

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
  const { user, tasks, badges, xp_log, completeTask, setDailyGoal } = useGame();
  const pet = petStage(user.level);
  const fb = useGameFeedback();

  const doneCount = tasks.filter((t) => t.status === "Done").length;
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayXp = xp_log[todayKey] ?? 0;

  const handleComplete = (id: string, anchor: { x: number; y: number }) => {
    fb.handleResult(completeTask(id), anchor);
  };

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-0">
      <HUD />
      <ToastStack items={fb.toasts} />
      <CompletionBurst events={fb.bursts} />
      <LevelUpOverlay
        open={fb.levelUp.open}
        level={fb.levelUp.level}
        onClose={() => fb.setLevelUp({ open: false, level: fb.levelUp.level })}
      />

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
          <QuestsPanel tasks={tasks} onComplete={handleComplete} />

          <section className="bg-pixel-surface border-2 border-pixel-pink shadow-pixel-pink p-6">
            <h3 className="font-pixel text-xs text-pixel-cyan mb-5">Pixel Companion</h3>
            <PetEvolution level={user.level} totalXp={user.total_xp} />
            <div className="mt-5 text-center">
              <Link to="/study">
                <span className="font-pixel text-[8px] text-pixel-cyan underline underline-offset-4">
                  Train in Study Room →
                </span>
              </Link>
            </div>
          </section>
        </div>

        <DailyGoalPanel
          todayXp={todayXp}
          goal={user.daily_xp_goal}
          xpLog={xp_log}
          onSetGoal={setDailyGoal}
        />

        <div className="grid md:grid-cols-4 gap-4">
          <Stat label="Total XP" value={user.total_xp} accent="cyan" />
          <Stat label="Level" value={levelFromXp(user.total_xp)} accent="pink" />
          <Stat label="Tasks Done" value={doneCount} accent="gold" />
          <Stat label="Streak 🔥" value={user.streak_count} accent="purple" />
        </div>

        <RecentBadgesPanel badges={badges} />
      </main>
    </div>
  );
}
