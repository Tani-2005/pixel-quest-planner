import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { HUD } from "@/components/HUD";
import { useGame } from "@/lib/store";
import { PixelButton } from "@/components/PixelButton";
import { RoomCard } from "@/components/RoomCard";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { motion } from "framer-motion";

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
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("pixelquest-store");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!parsed?.state?.authed) throw redirect({ to: "/login" });
      } else throw redirect({ to: "/login" });
    }
  },
  component: StudyLobby,
});

function StudyLobby() {
  const { rooms, sessions } = useGame();
  const totalMinutes = sessions.reduce((s, x) => s + x.minutes, 0);
  const todayMinutes = sessions
    .filter((s) => new Date(s.ended_at).toDateString() === new Date().toDateString())
    .reduce((s, x) => s + x.minutes, 0);

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-8 relative">
      <HUD />
      <AmbientBackdrop tone="cyan" />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 relative">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="font-pixel text-base md:text-lg text-pixel-cyan">Study Room</h1>
            <p className="font-pixel text-[8px] text-muted-foreground mt-2">
              Focus solo or with your party · 1 XP per minute
            </p>
          </div>
          <Link to="/study/solo">
            <PixelButton variant="accent" size="lg">
              ⏱ Solo Focus
            </PixelButton>
          </Link>
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
            ✦ More rooms coming · invite friends after Lovable Cloud is connected
          </p>
        </div>
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
