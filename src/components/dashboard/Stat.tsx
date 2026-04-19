interface StatProps {
  label: string;
  value: number | string;
  accent: "purple" | "pink" | "cyan" | "gold";
}

const map = {
  purple: "border-pixel-purple shadow-pixel text-pixel-purple",
  pink: "border-pixel-pink shadow-pixel-pink text-pixel-pink",
  cyan: "border-pixel-cyan shadow-pixel-cyan text-pixel-cyan",
  gold: "border-pixel-gold shadow-pixel-gold text-pixel-gold",
} as const;

export function Stat({ label, value, accent }: StatProps) {
  const cls = map[accent];
  const textColor = cls.split(" ").pop()!;
  return (
    <div className={`bg-pixel-surface border-2 p-4 ${cls}`}>
      <div className="font-pixel text-[8px] text-muted-foreground">{label}</div>
      <div className={`font-pixel text-2xl mt-2 ${textColor}`}>{value}</div>
    </div>
  );
}
