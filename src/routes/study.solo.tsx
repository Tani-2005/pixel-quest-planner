import { createFileRoute, Link } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth-guard";
import { HUD } from "@/components/HUD";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { ToastStack } from "@/components/PixelToast";
import { CompletionBurst } from "@/components/CompletionBurst";
import { useGame } from "@/lib/store";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { PixelButton } from "@/components/PixelButton";

export const Route = createFileRoute("/study/solo")({
  head: () => ({
    meta: [
      { title: "Solo Focus — PixelQuest" },
      { name: "description", content: "A single-player Pomodoro timer that earns XP per minute focused." },
    ],
  }),
  beforeLoad: requireAuth,
  component: SoloFocus,
});

function SoloFocus() {
  const { logStudySession } = useGame();
  const fb = useGameFeedback();

  const handleSession = (minutes: number) => {
    const r = logStudySession(minutes, null);
    fb.handleResult(
      { gainedXp: r.xp, leveledUp: false, newLevel: 0, newBadges: r.newBadges },
      { x: window.innerWidth / 2, y: window.innerHeight / 2 - 100 },
    );
  };

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-8 relative">
      <HUD />
      <AmbientBackdrop tone="purple" />
      <ToastStack items={fb.toasts} />
      <CompletionBurst events={fb.bursts} />

      <main className="max-w-2xl mx-auto px-4 md:px-6 py-8 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-pixel text-base text-pixel-cyan">Solo Focus</h1>
            <p className="font-pixel text-[8px] text-muted-foreground mt-2">
              Earn 1 XP per focused minute · 60 min total unlocks Focus Master
            </p>
          </div>
          <Link to="/study">
            <PixelButton variant="ghost" size="sm">
              ← Lobby
            </PixelButton>
          </Link>
        </div>

        <div className="bg-pixel-surface border-2 border-pixel-pink shadow-pixel-pink p-8">
          <PomodoroTimer onSessionComplete={handleSession} accent="pink" />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <Tip emoji="🎯" text="Pick one quest before starting" />
          <Tip emoji="📵" text="Silence notifications" />
          <Tip emoji="💧" text="Hydrate during breaks" />
        </div>
      </main>
    </div>
  );
}

function Tip({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="bg-pixel-surface border-2 border-pixel-purple p-3">
      <div className="text-xl mb-1">{emoji}</div>
      <div className="font-pixel text-[7px] text-muted-foreground leading-relaxed">{text}</div>
    </div>
  );
}
