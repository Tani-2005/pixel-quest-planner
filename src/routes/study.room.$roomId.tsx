import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { HUD } from "@/components/HUD";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { ToastStack } from "@/components/PixelToast";
import { CompletionBurst } from "@/components/CompletionBurst";
import { PixelButton } from "@/components/PixelButton";
import { useGame } from "@/lib/store";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/study/room/$roomId")({
  head: () => ({
    meta: [
      { title: "Study Room — PixelQuest" },
      { name: "description", content: "Focus together with your party in a shared study room." },
    ],
  }),
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("pixelquest-store");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!parsed?.state?.authed) throw redirect({ to: "/login" });
      } else throw redirect({ to: "/login" });
    }
  },
  notFoundComponent: RoomNotFound,
  component: RoomPage,
});

function RoomNotFound() {
  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20">
      <HUD />
      <main className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">🚪</div>
        <h1 className="font-pixel text-base text-pixel-pink">Room not found</h1>
        <Link to="/study">
          <PixelButton variant="ghost" className="mt-6">
            ← Back to Lobby
          </PixelButton>
        </Link>
      </main>
    </div>
  );
}

function RoomPage() {
  const { roomId } = Route.useParams();
  const { rooms, user, joinRoom, logStudySession } = useGame();
  const room = rooms.find((r) => r.id === roomId);
  const fb = useGameFeedback();
  const nav = useNavigate();
  const [cheers, setCheers] = useState<{ id: string; from: string }[]>([]);

  // join on mount
  useEffect(() => {
    if (!room) return;
    const r = joinRoom(room.id);
    if (r.newBadges.length) {
      fb.handleResult({ gainedXp: 0, leveledUp: false, newLevel: 0, newBadges: r.newBadges });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!room) {
    return <RoomNotFound />;
  }

  const handleSession = (minutes: number) => {
    const r = logStudySession(minutes, room.id);
    fb.handleResult(
      { gainedXp: r.xp, leveledUp: false, newLevel: 0, newBadges: r.newBadges },
      { x: window.innerWidth / 2, y: window.innerHeight / 2 - 100 },
    );
  };

  const cheer = (from: string) => {
    const id = crypto.randomUUID();
    setCheers((c) => [...c, { id, from }]);
    setTimeout(() => setCheers((c) => c.filter((x) => x.id !== id)), 2000);
    fb.pushToast({ id: crypto.randomUUID(), message: `🎉 ${from} cheered you on!`, variant: "xp" });
  };

  // mix the player into the member list
  const allMembers = [
    { name: user.username, emoji: "🧙", status: "focused" as const, you: true },
    ...room.members.map((m) => ({ ...m, you: false })),
  ];

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-8 relative">
      <HUD />
      <AmbientBackdrop tone="gold" />
      <ToastStack items={fb.toasts} />
      <CompletionBurst events={fb.bursts} />

      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 relative">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{room.emoji}</div>
            <div>
              <h1 className="font-pixel text-base text-pixel-cyan">{room.name}</h1>
              <p className="font-pixel text-[8px] text-muted-foreground mt-1">
                {room.subject} · {allMembers.length} members
              </p>
            </div>
          </div>
          <Link to="/study">
            <PixelButton variant="ghost" size="sm" onClick={() => nav({ to: "/study" })}>
              ← Leave Room
            </PixelButton>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* shared timer */}
          <div className="lg:col-span-2 bg-pixel-surface border-2 border-pixel-pink shadow-pixel-pink p-8 relative">
            <div className="font-pixel text-[8px] text-muted-foreground mb-4 text-center">
              SHARED FOCUS · everyone&apos;s timer
            </div>
            <PomodoroTimer
              workMinutes={room.active_timer_minutes}
              onSessionComplete={handleSession}
              accent="pink"
            />
          </div>

          {/* members */}
          <div className="bg-pixel-surface border-2 border-pixel-cyan shadow-pixel-cyan p-5">
            <h3 className="font-pixel text-xs text-pixel-cyan mb-4">Party</h3>
            <ul className="space-y-3">
              {allMembers.map((m) => (
                <li
                  key={m.name}
                  className={`flex items-center justify-between gap-2 bg-[oklch(0.14_0.06_295)] border ${
                    m.you ? "border-pixel-pink" : "border-pixel-purple"
                  } p-2`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <motion.span
                      className="text-2xl"
                      animate={m.status === "focused" ? { y: [0, -3, 0] } : {}}
                      transition={{ duration: 2.4, repeat: Infinity }}
                    >
                      {m.emoji}
                    </motion.span>
                    <div className="min-w-0">
                      <div className="font-sans text-xs font-medium truncate">
                        {m.name} {m.you && <span className="text-pixel-pink">(you)</span>}
                      </div>
                      <div
                        className={`font-pixel text-[7px] ${
                          m.status === "focused"
                            ? "text-pixel-green"
                            : m.status === "break"
                              ? "text-pixel-gold"
                              : "text-muted-foreground"
                        }`}
                      >
                        ● {m.status}
                      </div>
                    </div>
                  </div>
                  {!m.you && (
                    <button
                      onClick={() => cheer(m.name)}
                      className="font-pixel text-[8px] px-2 py-1 border border-pixel-gold text-pixel-gold hover:bg-pixel-gold hover:text-[oklch(0.18_0.08_295)]"
                      title="Cheer"
                    >
                      🎉
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* floating cheers */}
        <div className="fixed inset-x-0 top-32 z-[180] pointer-events-none flex flex-col items-center gap-2">
          {cheers.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="font-pixel text-[10px] bg-pixel-gold text-[oklch(0.18_0.08_295)] px-3 py-2 border-2 border-pixel-purple"
            >
              🎉 You cheered {c.from}!
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
