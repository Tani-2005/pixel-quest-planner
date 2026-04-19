import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  emoji: string;
  title: string;
  message: string;
  cta?: ReactNode;
  accent?: "purple" | "pink" | "cyan" | "gold";
}

const accentMap = {
  purple: "border-pixel-purple",
  pink: "border-pixel-pink",
  cyan: "border-pixel-cyan",
  gold: "border-pixel-gold",
};

export function EmptyState({ emoji, title, message, cta, accent = "purple" }: Props) {
  return (
    <div className={`bg-pixel-surface border-2 ${accentMap[accent]} p-10 text-center`}>
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="text-6xl mb-5 inline-block"
      >
        {emoji}
      </motion.div>
      <div className="font-pixel text-xs text-pixel-cyan mb-3">{title}</div>
      <p className="font-sans text-sm text-muted-foreground max-w-sm mx-auto">{message}</p>
      {cta && <div className="mt-6 flex justify-center">{cta}</div>}
    </div>
  );
}
