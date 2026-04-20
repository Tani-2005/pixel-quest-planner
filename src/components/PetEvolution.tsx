import { motion } from "framer-motion";
import { petStage, useGame, PetHat } from "@/lib/store";

interface Props {
  level: number;
  totalXp: number;
}

const HAT_EMOJI: Record<PetHat, string> = {
  none: "",
  crown: "👑",
  wizard: "🧙‍♂️",
  cap: "🧢",
  halo: "😇",
};

export function PetEvolution({ level, totalXp }: Props) {
  const pet = petStage(level);
  const { user } = useGame();
  const hat = HAT_EMOJI[user.pet_hat];
  const displayName = user.pet_name?.trim() || pet.name;
  const xpToNext = pet.next === 999 ? 100 : (pet.next - pet.min) * 100;
  const xpFromStage = totalXp - (pet.min - 1) * 100;
  const evoPct = pet.next === 999 ? 100 : Math.min(100, (xpFromStage / xpToNext) * 100);

  const auraColor =
    pet.stage === "Legendary"
      ? "var(--pixel-gold)"
      : pet.stage === "Bonded"
        ? "var(--pixel-pink)"
        : pet.stage === "Awakened"
          ? "var(--pixel-cyan)"
          : "var(--pixel-purple)";

  return (
    <div className="text-center relative">
      {/* Aura */}
      <div className="relative inline-block">
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: `radial-gradient(circle, ${auraColor} 0%, transparent 70%)`,
          }}
          className="absolute inset-0 -m-8 blur-xl"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl relative"
        >
          {pet.emoji}
          {hat && (
            <span
              aria-hidden
              className="absolute text-3xl"
              style={{ top: "-12%", left: "50%", transform: "translateX(-50%) rotate(-8deg)" }}
            >
              {hat}
            </span>
          )}
        </motion.div>
      </div>

      <div className="font-pixel text-sm text-pixel-pink mt-2">{displayName}</div>
      <div className="font-pixel text-[8px] text-muted-foreground mt-1">
        {pet.stage} · {pet.name}
      </div>

      <div className="mt-5">
        <div className="flex justify-between font-pixel text-[8px] text-muted-foreground mb-1">
          <span>Evolution</span>
          <span>{Math.floor(evoPct)}%</span>
        </div>
        <div className="relative h-3 bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${evoPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-pixel-gold relative"
          >
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          </motion.div>
        </div>
      </div>

      {/* Next form preview */}
      {pet.next !== 999 && (
        <div className="mt-5 flex items-center justify-center gap-3 font-pixel text-[8px] text-muted-foreground">
          <span>Next form</span>
          <motion.span
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="text-2xl"
            style={{ filter: "brightness(0) invert(0.4)" }}
          >
            {pet.nextEmoji}
          </motion.span>
          <span>at LVL {pet.next}</span>
        </div>
      )}
    </div>
  );
}
