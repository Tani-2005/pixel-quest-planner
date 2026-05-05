import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth-guard";
import { HUD } from "@/components/HUD";
import { useGame, type RoomMode } from "@/lib/store";
import { PixelButton } from "@/components/PixelButton";
import { RoomCard } from "@/components/RoomCard";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { CreateRoomDialog } from "@/components/CreateRoomDialog";
import { ToastStack } from "@/components/PixelToast";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/study")({
  head: () => ({
    meta: [
      { title: "Study Room — PixelQuest" },
      {
        name: "description",
        content: "Solo focus timer or join a study room with your party. Earn XP for every minute focused.",
      },
    ],
  }),
  beforeLoad: requireAuth,
  component: StudyLobby,
});

function StudyLobby() {
  const { rooms, sessions, createRoom, joinRoomByCode } = useGame();
  const fb = useGameFeedback();
  const nav = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);

  const totalMinutes = sessions.reduce((s, x) => s + x.minutes, 0);
  const todayMinutes = sessions
    .filter((s) => new Date(s.ended_at).toDateString() === new Date().toDateString())
    .reduce((s, x) => s + x.minutes, 0);

  const handleCreate = (input: {
    name: string;
    subject: string;
    emoji: string;
    timerMinutes: number;
    breakMinutes: number;
    mode: RoomMode;
  }) => {
    const r = createRoom(input);
    fb.pushToast({
      id: crypto.randomUUID(),
      message: `🛠 Room "${r.room.name}" created! Code: ${r.room.code}`,
      variant: "xp",
    });
    if (r.newBadges.length) {
      fb.handleResult({ gainedXp: 0, leveledUp: false, newLevel: 0, newBadges: r.newBadges });
    }
    nav({ to: "/study/room/$roomId", params: { roomId: r.room.id } });
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);
    if (!joinCode.trim()) return;
    const { room, newBadges } = joinRoomByCode(joinCode);
    if (!room) {
      setJoinError("No room with that code. Double-check and try again.");
      return;
    }
    if (newBadges.length) {
      fb.handleResult({ gainedXp: 0, leveledUp: false, newLevel: 0, newBadges });
    }
    setJoinCode("");
    nav({ to: "/study/room/$roomId", params: { roomId: room.id } });
  };

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-8 relative">
      <HUD />
      <AmbientBackdrop tone="cyan" />
      <ToastStack items={fb.toasts} />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 relative">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-pixel text-base md:text-lg text-pixel-cyan">Study Room</h1>
            <p className="font-pixel text-[8px] text-muted-foreground mt-2">
              Focus solo or with your party · 1 XP per minute
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PixelButton variant="secondary" size="lg" onClick={() => setCreateOpen(true)}>
              ✦ Create Room
            </PixelButton>
            <Link to="/study/solo">
              <PixelButton variant="accent" size="lg">
                ⏱ Solo Focus
              </PixelButton>
            </Link>
          </div>
        </div>

        {/* join by code */}
        <div className="bg-pixel-surface border-2 border-pixel-cyan shadow-pixel-cyan p-5 mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-pixel text-xs text-pixel-cyan">🔑 Join by Code</h2>
              <p className="font-pixel text-[8px] text-muted-foreground mt-2">
                Got a 6-character room code from a friend? Drop it here.
              </p>
            </div>
            <form onSubmit={handleJoinByCode} className="flex gap-2 flex-wrap">
              <input
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value.toUpperCase().slice(0, 6));
                  setJoinError(null);
                }}
                placeholder="ABC123"
                maxLength={6}
                className="font-pixel text-sm tracking-[0.3em] uppercase bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-2 w-36 text-pixel-cyan focus:border-pixel-pink outline-none"
              />
              <PixelButton type="submit" variant="cyan" size="sm" disabled={joinCode.length < 4}>
                Join →
              </PixelButton>
            </form>
          </div>
          {joinError && (
            <p className="font-pixel text-[8px] text-pixel-red mt-3">⚠ {joinError}</p>
          )}
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <Stat label="Today" value={`${todayMinutes}m`} accent="cyan" />
          <Stat label="All-time" value={`${totalMinutes}m`} accent="pink" />
          <Stat label="Sessions" value={sessions.length} accent="gold" />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-pixel text-xs text-pixel-pink">Open Rooms</h2>
          <span className="font-pixel text-[8px] text-muted-foreground">
            {rooms.length} room{rooms.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <RoomCard room={r} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10 bg-pixel-surface border-2 border-dashed border-pixel-purple p-6 text-center">
          <p className="font-pixel text-[10px] text-muted-foreground">
            ✦ Want a custom Pomodoro length & subject? Hit{" "}
            <button
              onClick={() => setCreateOpen(true)}
              className="text-pixel-cyan hover:text-pixel-pink underline"
            >
              Create Room
            </button>
            .
          </p>
        </div>
      </main>

      <CreateRoomDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
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
  accent: "cyan" | "pink" | "gold";
}) {
  const map = {
    cyan: "border-pixel-cyan shadow-pixel-cyan text-pixel-cyan",
    pink: "border-pixel-pink shadow-pixel-pink text-pixel-pink",
    gold: "border-pixel-gold shadow-pixel-gold text-pixel-gold",
  };
  const cls = map[accent];
  return (
    <div className={`bg-pixel-surface border-2 p-4 ${cls}`}>
      <div className="font-pixel text-[8px] text-muted-foreground">{label}</div>
      <div className={`font-pixel text-xl mt-2 ${cls.split(" ").pop()}`}>{value}</div>
    </div>
  );
}
