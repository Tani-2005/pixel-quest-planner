import { motion } from "framer-motion";
import { levelFromXp } from "@/lib/store";

interface Props {
  totalXp: number;
  showLabel?: boolean;
  compact?: boolean;
}

export function XPBar({ totalXp, showLabel = true, compact = false }: Props) {
  const level = levelFromXp(totalXp);
  const intoLevel = totalXp % 100;
  const pct = intoLevel; // out of 100

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 font-pixel text-[8px] text-pixel-cyan">
          <span>LVL {level}</span>
          <span>{intoLevel} / 100 XP</span>
        </div>
      )}
      <div
        className={`relative w-full ${compact ? "h-2" : "h-3"} bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple overflow-hidden`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-pixel-pink"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, oklch(0.65 0.25 350) 0 6px, oklch(0.55 0.21 295) 6px 8px)",
          }}
        />
      </div>
    </div>
  );
}
