import { AnimatePresence, motion } from "framer-motion";

export interface ToastItem {
  id: string;
  message: string;
  variant?: "xp" | "badge" | "level";
}

export function ToastStack({ items }: { items: ToastItem[] }) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={
              t.variant === "badge"
                ? "font-pixel text-xs bg-pixel-gold text-[oklch(0.18_0.08_295)] px-4 py-3 border-2 border-pixel-purple shadow-pixel"
                : t.variant === "level"
                  ? "font-pixel text-xs bg-pixel-pink text-white px-4 py-3 border-2 border-pixel-purple shadow-pixel"
                  : "font-pixel text-xs bg-pixel-cyan text-[oklch(0.18_0.08_295)] px-4 py-3 border-2 border-pixel-purple shadow-pixel"
            }
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
