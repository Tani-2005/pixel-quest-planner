import { motion } from "framer-motion";

interface StatProps {
  label: string;
  value: number | string;
  accent: "purple" | "pink" | "cyan" | "gold";
  icon?: string;
  delay?: number;
}

const map = {
  purple: { border: "border-pixel-purple", shadow: "shadow-pixel", text: "text-pixel-purple", chip: "bg-pixel-purple" },
  pink: { border: "border-pixel-pink", shadow: "shadow-pixel-pink", text: "text-pixel-pink", chip: "bg-pixel-pink" },
  cyan: { border: "border-pixel-cyan", shadow: "shadow-pixel-cyan", text: "text-pixel-cyan", chip: "bg-pixel-cyan" },
  gold: { border: "border-pixel-gold", shadow: "shadow-pixel-gold", text: "text-pixel-gold", chip: "bg-pixel-gold" },
} as const;

export function Stat({ label, value, accent, icon, delay = 0 }: StatProps) {
  const cls = map[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3 }}
      className={`relative bg-pixel-surface border-2 p-4 ${cls.border} ${cls.shadow} overflow-hidden`}
    >
      <div className={`absolute -top-6 -right-6 w-16 h-16 ${cls.chip} opacity-10 rotate-12`} />
      <div className="flex items-center justify-between gap-2">
        <div className="font-pixel text-[8px] text-muted-foreground uppercase tracking-wide">{label}</div>
        {icon && <span className="text-base">{icon}</span>}
      </div>
      <div className={`font-pixel text-2xl mt-2 ${cls.text} text-shadow-pixel`}>{value}</div>
    </motion.div>
  );
}
