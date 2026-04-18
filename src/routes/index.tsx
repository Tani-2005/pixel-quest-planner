import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PixelButton } from "@/components/PixelButton";
import spriteFireball from "@/assets/sprite-fireball.png";
import spriteCrystal from "@/assets/sprite-crystal.png";
import spriteWhale from "@/assets/sprite-whale.png";
import spriteGalaxy from "@/assets/sprite-galaxy.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PixelQuest — A Gamified Student Planner" },
      {
        name: "description",
        content:
          "Turn your homework into a quest. Earn XP, level up your pixel pet, and study with friends in real time.",
      },
      { property: "og:title", content: "PixelQuest — A Gamified Student Planner" },
      {
        property: "og:description",
        content:
          "Turn your homework into a quest. Earn XP, level up your pixel pet, and study with friends in real time.",
      },
    ],
  }),
  component: Landing,
});

const SPRITES = [spriteFireball, spriteCrystal, spriteWhale, spriteGalaxy];

// Pre-placed slots across the page so sprites pop in different regions.
// Avoid the central hero text column (roughly 30%–70% horizontally in the upper area).
const SLOTS: Array<{ x: string; y: string; size: number }> = [
  { x: "4%",  y: "12%", size: 56 },
  { x: "88%", y: "10%", size: 48 },
  { x: "10%", y: "38%", size: 64 },
  { x: "84%", y: "32%", size: 56 },
  { x: "6%",  y: "62%", size: 52 },
  { x: "90%", y: "58%", size: 60 },
  { x: "18%", y: "82%", size: 48 },
  { x: "78%", y: "84%", size: 56 },
  { x: "45%", y: "92%", size: 44 },
  { x: "50%", y: "4%",  size: 40 },
];

type Floater = {
  id: number;
  src: string;
  x: string;
  y: string;
  size: number;
};

function Landing() {
  const [floaters, setFloaters] = useState<Floater[]>([]);

  useEffect(() => {
    let nextId = 0;
    const occupied = new Set<number>();

    const spawn = () => {
      // pick a free slot
      const free = SLOTS.map((_, i) => i).filter((i) => !occupied.has(i));
      if (free.length === 0) return;
      const slotIdx = free[Math.floor(Math.random() * free.length)];
      const slot = SLOTS[slotIdx];
      const src = SPRITES[Math.floor(Math.random() * SPRITES.length)];
      const id = nextId++;
      occupied.add(slotIdx);

      setFloaters((prev) => [...prev, { id, src, x: slot.x, y: slot.y, size: slot.size }]);

      // remove after a lifetime so it pops in then out
      const lifetime = 2800 + Math.random() * 2200;
      window.setTimeout(() => {
        setFloaters((prev) => prev.filter((f) => f.id !== id));
        occupied.delete(slotIdx);
      }, lifetime);
    };

    // initial burst
    for (let i = 0; i < 4; i++) {
      window.setTimeout(spawn, i * 350);
    }

    const interval = window.setInterval(spawn, 1100);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pixel-grid-bg">
      {/* Top nav */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👾</span>
          <span className="font-pixel text-[10px] text-pixel-cyan">PixelQuest</span>
        </div>
        <div className="flex gap-2">
          <Link to="/login">
            <PixelButton variant="ghost" size="sm">
              Login
            </PixelButton>
          </Link>
          <Link to="/signup">
            <PixelButton variant="accent" size="sm">
              Start Quest →
            </PixelButton>
          </Link>
        </div>
      </header>

      {/* Pop-in / pop-out pixel-art sprites scattered around the page */}
      <AnimatePresence>
        {floaters.map((f) => (
          <motion.img
            key={f.id}
            src={f.src}
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.9, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: f.x,
              top: f.y,
              width: f.size,
              height: f.size,
              imageRendering: "pixelated",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        ))}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-24 text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-pixel text-3xl sm:text-5xl md:text-6xl text-pixel-cyan text-shadow-pixel"
        >
          PixelQuest
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-pixel text-[10px] sm:text-xs text-muted-foreground mt-6 max-w-xl mx-auto"
        >
          A Gamified Student Planner<span className="animate-blink">_</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="font-sans text-base sm:text-lg text-foreground/80 mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          Turn homework into quests. Earn XP, evolve your pixel pet, keep your streak alive,
          and study side-by-side with friends in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/signup">
            <PixelButton variant="accent" size="lg">
              ▶ Start Your Quest
            </PixelButton>
          </Link>
          <Link to="/login">
            <PixelButton variant="secondary" size="lg">
              Login
            </PixelButton>
          </Link>
        </motion.div>
      </section>

      {/* Feature trio — Jules-style chips */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "📜",
              title: "Tasks → XP",
              desc: "Every quest you finish drops XP. Bonus loot for early submissions.",
              accent: "border-pixel-cyan shadow-pixel-cyan",
              chip: "bg-pixel-cyan",
            },
            {
              icon: "⚡",
              title: "Level Up",
              desc: "Watch your egg crack into a hatchling, familiar, and finally a dragon.",
              accent: "border-pixel-pink shadow-pixel-pink",
              chip: "bg-pixel-pink text-white",
            },
            {
              icon: "🧑‍💻",
              title: "Study Room",
              desc: "Drop into a room with friends. Live focus status, no video, no chat.",
              accent: "border-pixel-gold shadow-pixel-gold",
              chip: "bg-pixel-gold",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-pixel-surface border-2 ${f.accent} p-6`}
            >
              <div
                className={`inline-block font-pixel text-[10px] px-2 py-1 border-2 border-pixel-purple text-[oklch(0.18_0.08_295)] ${f.chip}`}
              >
                {f.icon} {f.title}
              </div>
              <p className="font-sans text-sm text-foreground/80 mt-4 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 max-w-6xl mx-auto px-6 pb-10 text-center">
        <p className="font-pixel text-[8px] text-muted-foreground">
          © PixelQuest — press start to play
        </p>
      </footer>
    </div>
  );
}
