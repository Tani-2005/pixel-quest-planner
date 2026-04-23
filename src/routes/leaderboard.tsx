import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth-guard";
import { HUD } from "@/components/HUD";
import { useGame } from "@/lib/store";
import { motion } from "framer-motion";
import { useMemo } from "react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — PixelQuest" },
      { name: "description", content: "Weekly focus-minute leaderboard for you and your study squad." },
    ],
  }),
  beforeLoad: requireAuth,
  component: Leaderboard,
});

function Leaderboard() {
  const { friends, sessions, user } = useGame();

  const myWeeklyMinutes = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    return sessions
      .filter((s) => new Date(s.ended_at).getTime() >= weekAgo)
      .reduce((sum, s) => sum + s.minutes, 0);
  }, [sessions]);

  const ranked = useMemo(() => {
    const entries = [
      {
        id: "me",
        name: user.username || "You",
        emoji: user.avatar_emoji || "🧙",
        minutes: myWeeklyMinutes,
        xp: user.weekly_xp,
        you: true,
      },
      ...friends.map((f) => ({
        id: f.id,
        name: f.name,
        emoji: f.emoji,
        minutes: f.weekly_minutes,
        xp: f.weekly_xp,
        you: false,
      })),
    ];
    return entries.sort((a, b) => b.minutes - a.minutes);
  }, [friends, myWeeklyMinutes, user.username, user.avatar_emoji, user.weekly_xp]);

  const top = ranked[0]?.minutes || 1;

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-8">
      <HUD />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div>
            <h1 className="font-pixel text-base md:text-lg text-pixel-pink">🏆 Leaderboard</h1>
            <p className="font-pixel text-[8px] text-muted-foreground mt-2">
              This week · ranked by focus minutes
            </p>
          </div>
          <div className="font-pixel text-[10px] bg-pixel-gold text-[oklch(0.18_0.08_295)] px-3 py-2 border-2 border-pixel-purple">
            YOU · {myWeeklyMinutes}m
          </div>
        </div>

        <div className="space-y-2">
          {ranked.map((r, i) => {
            const pct = Math.max(4, Math.round((r.minutes / top) * 100));
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-pixel-surface border-2 ${
                  r.you ? "border-pixel-pink shadow-pixel-pink" : "border-pixel-purple"
                } p-4 flex items-center gap-4`}
              >
                <div className="font-pixel text-sm w-12 shrink-0 text-pixel-gold">{medal}</div>
                <div className="text-3xl shrink-0">{r.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-sans text-sm font-medium">
                        {r.name}{" "}
                        {r.you && <span className="font-pixel text-[8px] text-pixel-pink">(you)</span>}
                      </div>
                      <div className="font-pixel text-[8px] text-muted-foreground mt-1">
                        {r.xp} XP this week
                      </div>
                    </div>
                    <div className="font-pixel text-xs text-pixel-cyan">{r.minutes}m</div>
                  </div>
                  <div className="h-2 bg-[oklch(0.14_0.06_295)] border border-pixel-purple mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1 + i * 0.04 }}
                      className={r.you ? "h-full bg-pixel-pink" : "h-full bg-pixel-cyan"}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 bg-pixel-surface border-2 border-dashed border-pixel-purple p-5 text-center">
          <p className="font-pixel text-[10px] text-muted-foreground">
            ✦ Add friends in Friends tab · scores reset each Monday
          </p>
        </div>
      </main>
    </div>
  );
}
