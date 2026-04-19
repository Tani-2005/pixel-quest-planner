import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export interface BurstEvent {
  id: string;
  xp: number;
  // optional anchor point (viewport coords)
  x?: number;
  y?: number;
}

export function CompletionBurst({ events }: { events: BurstEvent[] }) {
  return (
    <div className="fixed inset-0 z-[180] pointer-events-none">
      <AnimatePresence>
        {events.map((e) => (
          <Burst key={e.id} event={e} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Burst({ event }: { event: BurstEvent }) {
  const [origin] = useState(() => ({
    x: event.x ?? window.innerWidth / 2,
    y: event.y ?? window.innerHeight / 2,
  }));

  const particles = Array.from({ length: 10 });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 0.6 }}
        animate={{ opacity: [0, 1, 1, 0], y: -80, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ position: "absolute", left: origin.x, top: origin.y }}
        className="font-pixel text-pixel-gold text-base text-shadow-pixel -translate-x-1/2"
      >
        +{event.xp} XP
      </motion.div>
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dx = Math.cos(angle) * 70;
        const dy = Math.sin(angle) * 70;
        const colors = ["bg-pixel-gold", "bg-pixel-pink", "bg-pixel-cyan"];
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: dx, y: dy, scale: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ position: "absolute", left: origin.x, top: origin.y }}
            className={`w-2 h-2 ${color} -translate-x-1/2 -translate-y-1/2`}
          />
        );
      })}
    </>
  );
}
