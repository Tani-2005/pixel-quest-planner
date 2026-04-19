import { motion } from "framer-motion";

interface Props {
  xpLog: Record<string, number>;
  days?: number;
}

export function StreakCalendar({ xpLog, days = 14 }: Props) {
  const today = new Date();
  const cells = Array.from({ length: days }).map((_, i) => {
    const d = new Date(today.getTime() - (days - 1 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    const xp = xpLog[key] ?? 0;
    return {
      key,
      xp,
      isToday: i === days - 1,
      label: d.toLocaleDateString(undefined, { weekday: "short" })[0],
    };
  });

  return (
    <div>
      <div className="flex justify-between font-pixel text-[8px] text-muted-foreground mb-2">
        <span>Streak (last {days} days)</span>
        <span className="text-pixel-gold">
          🔥 {cells.filter((c) => c.xp > 0).length}/{days}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-14">
        {cells.map((c) => {
          const intensity = c.xp === 0 ? 0 : c.xp < 25 ? 1 : c.xp < 75 ? 2 : 3;
          const bg =
            intensity === 0
              ? "bg-[oklch(0.22_0.08_290)]"
              : intensity === 1
                ? "bg-pixel-purple"
                : intensity === 2
                  ? "bg-pixel-pink"
                  : "bg-pixel-gold";
          const cell = (
            <div
              className={`w-full aspect-square border border-pixel-purple ${bg} ${
                c.isToday ? "ring-2 ring-pixel-cyan ring-offset-1 ring-offset-pixel-surface" : ""
              }`}
              title={`${c.key}: ${c.xp} XP`}
            />
          );
          return (
            <div key={c.key} className="flex flex-col items-center gap-1">
              {c.isToday ? (
                <motion.div
                  className="w-full"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  {cell}
                </motion.div>
              ) : (
                cell
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
