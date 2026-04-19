import { motion } from "framer-motion";

/**
 * Cozy ambient pixel backdrop: floating dots + scanline glow.
 * Purely decorative.
 */
export function AmbientBackdrop({ tone = "purple" }: { tone?: "purple" | "cyan" | "gold" }) {
  const colorVar =
    tone === "cyan" ? "var(--pixel-cyan)" : tone === "gold" ? "var(--pixel-gold)" : "var(--pixel-pink)";

  const dots = Array.from({ length: 18 });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* radial glow */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${colorVar}, transparent 60%)`,
          filter: "blur(40px)",
        }}
      />
      {/* floating pixels */}
      {dots.map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i % 7) * 0.8;
        const dur = 6 + (i % 5);
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5"
            style={{
              left: `${left}%`,
              bottom: -10,
              backgroundColor: colorVar,
            }}
            animate={{ y: [-0, -800], opacity: [0, 0.7, 0] }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "linear" }}
          />
        );
      })}
    </div>
  );
}
