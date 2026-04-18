import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

export function LevelUpOverlay({
  open,
  level,
  onClose,
}: {
  open: boolean;
  level: number;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[300] bg-[oklch(0.10_0.06_295)]/90 flex items-center justify-center cursor-pointer"
        >
          {/* burst sparkles */}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2;
            const dx = Math.cos(angle) * 220;
            const dy = Math.sin(angle) * 220;
            return (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
                animate={{ x: dx, y: dy, opacity: [0, 1, 0], scale: 1 }}
                transition={{ duration: 1.4, delay: 0.05 * i, repeat: Infinity, repeatDelay: 0.6 }}
                className="absolute text-2xl"
              >
                ✦
              </motion.div>
            );
          })}
          <motion.div
            initial={{ scale: 0.5, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="text-center"
          >
            <div className="font-pixel text-pixel-gold text-3xl md:text-5xl text-shadow-pixel">
              LEVEL UP!
            </div>
            <div className="font-pixel text-pixel-cyan text-lg md:text-2xl mt-6">
              → Level {level}
            </div>
            <div className="font-pixel text-[10px] text-muted-foreground mt-8 animate-blink">
              click to continue
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
