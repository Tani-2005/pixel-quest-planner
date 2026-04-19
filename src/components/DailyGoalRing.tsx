import { motion } from "framer-motion";

interface Props {
  todayXp: number;
  goal: number;
  size?: number;
}

export function DailyGoalRing({ todayXp, goal, size = 120 }: Props) {
  const pct = Math.min(100, (todayXp / Math.max(1, goal)) * 100);
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const done = pct >= 100;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ shapeRendering: "crispEdges" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="oklch(0.30 0.11 290)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={done ? "var(--pixel-gold)" : "var(--pixel-pink)"}
          strokeWidth={stroke}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-pixel text-[8px] text-muted-foreground">TODAY</div>
        <div className={`font-pixel text-base ${done ? "text-pixel-gold" : "text-pixel-pink"}`}>
          {todayXp}
        </div>
        <div className="font-pixel text-[8px] text-muted-foreground">/ {goal} XP</div>
      </div>
    </div>
  );
}
