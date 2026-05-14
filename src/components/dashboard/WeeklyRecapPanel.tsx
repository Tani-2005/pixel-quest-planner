import { useMemo } from "react";
import { motion } from "framer-motion";
import { Task } from "@/lib/store";

interface Props {
  xpLog: Record<string, number>;
  tasks: Task[];
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

export function WeeklyRecapPanel({ xpLog, tasks }: Props) {
  const data = useMemo(() => {
    const now = new Date();
    const days: { key: string; label: string; xp: number }[] = [];
    let weeklyXp = 0;
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const k = dayKey(d);
      const xp = xpLog[k] ?? 0;
      weeklyXp += xp;
      days.push({ key: k, label: d.toLocaleDateString(undefined, { weekday: "short" })[0], xp });
    }
    const max = Math.max(50, ...days.map((d) => d.xp));

    const weekStart = new Date(now.getTime() - 6 * 86400000);
    weekStart.setHours(0, 0, 0, 0);

    const tasksDone = tasks.filter(
      (t) => t.completed_at && new Date(t.completed_at).getTime() >= weekStart.getTime(),
    ).length;
    const bestDay = [...days].sort((a, b) => b.xp - a.xp)[0];

    return { days, max, weeklyXp, tasksDone, bestDay };
  }, [xpLog, tasks]);

  return (
    <section className="bg-pixel-surface border-2 border-pixel-gold shadow-pixel-gold p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <h3 className="font-pixel text-xs text-pixel-gold">Weekly Recap</h3>
        <span className="font-pixel text-[8px] text-muted-foreground">last 7 days</span>
      </div>

      <div className="grid md:grid-cols-[1fr,auto] gap-6 items-end">
        <div className="flex items-end justify-between gap-1 h-32">
          {data.days.map((d, i) => {
            const h = (d.xp / data.max) * 100;
            return (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(4, h)}%` }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                  className={`w-full ${d.xp > 0 ? "bg-pixel-gold" : "bg-pixel-purple/30"} border-t-2 border-pixel-purple`}
                  style={{ minHeight: 4 }}
                  title={`${d.xp} XP`}
                />
                <div className="font-pixel text-[7px] text-muted-foreground">{d.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 md:min-w-[140px]">
          <Mini label="Total XP" value={data.weeklyXp} accent="text-pixel-gold" />
          <Mini label="Tasks done" value={data.tasksDone} accent="text-pixel-pink" />
        </div>
      </div>
    </section>
  );
}

function Mini({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple p-2 text-center">
      <div className={`font-pixel text-base ${accent}`}>{value}</div>
      <div className="font-pixel text-[7px] text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
