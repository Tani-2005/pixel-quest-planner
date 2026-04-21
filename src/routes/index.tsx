import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { PixelButton } from "@/components/PixelButton";
import spriteFireball from "@/assets/sprite-fireball.png";
import spriteCrystal from "@/assets/sprite-crystal.png";
import spriteWhale from "@/assets/sprite-whale.png";
import spriteGalaxy from "@/assets/sprite-galaxy.png";
import heroArt from "@/assets/landing-hero.png";
import shotTasks from "@/assets/screenshot-tasks.png";
import shotRoom from "@/assets/screenshot-room.png";
import shotPet from "@/assets/screenshot-pet.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PixelQuest — A Gamified Student Planner" },
      {
        name: "description",
        content:
          "Turn homework into quests. Earn XP, evolve your pixel pet, and study with friends in real time.",
      },
      { property: "og:title", content: "PixelQuest — A Gamified Student Planner" },
      {
        property: "og:description",
        content:
          "Turn homework into quests. Earn XP, evolve your pixel pet, and study with friends in real time.",
      },
      { property: "og:image", content: heroArt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroArt },
    ],
  }),
  component: Landing,
});

const SPRITES = [spriteFireball, spriteCrystal, spriteWhale, spriteGalaxy];
const SLOTS: Array<{ x: string; y: string; size: number }> = [
  { x: "4%", y: "12%", size: 56 },
  { x: "92%", y: "10%", size: 48 },
  { x: "8%", y: "44%", size: 60 },
  { x: "90%", y: "40%", size: 52 },
];

type Floater = { id: number; src: string; x: string; y: string; size: number };

const FEATURES = [
  {
    icon: "📜",
    title: "Tasks → XP",
    desc: "Every quest you finish drops XP. Difficulty multipliers, early-bird bonuses, recurring quests.",
    chip: "bg-pixel-cyan",
    border: "border-pixel-cyan shadow-pixel-cyan",
    shot: shotTasks,
  },
  {
    icon: "🐉",
    title: "Pet Evolution",
    desc: "Your egg cracks into a hatchling, then a familiar, then a dragon. Hats and names included.",
    chip: "bg-pixel-pink text-white",
    border: "border-pixel-pink shadow-pixel-pink",
    shot: shotPet,
  },
  {
    icon: "🧑‍💻",
    title: "Study Rooms",
    desc: "Drop in with your party. Shared Pomodoros, live focus status, cheers and emoji reactions.",
    chip: "bg-pixel-gold",
    border: "border-pixel-gold shadow-pixel-gold",
    shot: shotRoom,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I finally finished a problem set without doom-scrolling. Watching my pet level up actually works on my brain.",
    name: "Aria",
    role: "Math major",
    emoji: "🦊",
  },
  {
    quote:
      "Study rooms with my friends + the cheer button = the only reason I survived finals week.",
    name: "Kenji",
    role: "CS sophomore",
    emoji: "🐼",
  },
  {
    quote: "The streak is petty motivation but holy crap it works. 41 days in.",
    name: "Lin",
    role: "Lit / Phil",
    emoji: "🦉",
  },
];

const STATS = [
  { value: "1 XP", label: "per focus minute" },
  { value: "10+", label: "badges to unlock" },
  { value: "4", label: "pet evolution stages" },
  { value: "∞", label: "quests, recurring & one-shot" },
];

function Landing() {
  const [floaters, setFloaters] = useState<Floater[]>([]);

  useEffect(() => {
    let nextId = 0;
    const occupied = new Set<number>();
    const spawn = () => {
      const free = SLOTS.map((_, i) => i).filter((i) => !occupied.has(i));
      if (!free.length) return;
      const slotIdx = free[Math.floor(Math.random() * free.length)];
      const slot = SLOTS[slotIdx];
      const src = SPRITES[Math.floor(Math.random() * SPRITES.length)];
      const id = nextId++;
      occupied.add(slotIdx);
      setFloaters((p) => [...p, { id, src, x: slot.x, y: slot.y, size: slot.size }]);
      window.setTimeout(() => {
        setFloaters((p) => p.filter((f) => f.id !== id));
        occupied.delete(slotIdx);
      }, 3000 + Math.random() * 2000);
    };
    for (let i = 0; i < 3; i++) window.setTimeout(spawn, i * 400);
    const interval = window.setInterval(spawn, 1400);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pixel-grid-bg">
      {/* Top nav */}
      <header className="relative z-20 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👾</span>
          <span className="font-pixel text-[10px] text-pixel-cyan">PixelQuest</span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          <a href="#features" className="font-pixel text-[9px] px-3 py-2 text-muted-foreground hover:text-pixel-cyan">
            Features
          </a>
          <a href="#testimonials" className="font-pixel text-[9px] px-3 py-2 text-muted-foreground hover:text-pixel-cyan">
            Players
          </a>
          <Link to="/changelog" className="font-pixel text-[9px] px-3 py-2 text-muted-foreground hover:text-pixel-cyan">
            Changelog
          </Link>
        </nav>
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

      {/* floating sprites */}
      <AnimatePresence>
        {floaters.map((f) => (
          <motion.img
            key={f.id}
            src={f.src}
            alt=""
            aria-hidden
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.85, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.45 }}
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

      {/* Hero — split layout with art on right */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-10 md:pt-16 pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block font-pixel text-[8px] px-2 py-1 bg-pixel-pink text-white border-2 border-pixel-purple"
            >
              ▶ NEW · v0.4 — STUDY ROOMS
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-pixel text-3xl sm:text-4xl md:text-5xl text-pixel-cyan text-shadow-pixel mt-5 leading-tight"
            >
              Homework
              <br />
              hits different
              <br />
              as a quest.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-sans text-base md:text-lg text-foreground/80 mt-6 max-w-md leading-relaxed"
            >
              Track tasks, earn XP, evolve a pixel pet, and grind side-by-side with friends in
              shared focus rooms. Built for students who already game.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-3"
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
            <p className="font-pixel text-[8px] text-muted-foreground mt-5">
              Free · No card · Save anywhere<span className="animate-blink">_</span>
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-pixel-surface border-4 border-pixel-pink shadow-pixel-pink">
              <img
                src={heroArt}
                alt="PixelQuest hero — wizard, XP crystal and dragon hatchling"
                className="block w-full h-auto"
                style={{ imageRendering: "pixelated" }}
                width={1024}
                height={1024}
              />
              <div className="absolute -top-3 -left-3 font-pixel text-[10px] bg-pixel-cyan text-[oklch(0.18_0.08_295)] px-2 py-1 border-2 border-pixel-purple">
                LVL 12
              </div>
              <div className="absolute -bottom-3 -right-3 font-pixel text-[10px] bg-pixel-gold text-[oklch(0.18_0.08_295)] px-2 py-1 border-2 border-pixel-purple">
                +480 XP
              </div>
            </div>
          </motion.div>
        </div>

        {/* stat strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-pixel-surface border-2 border-pixel-purple p-4 text-center"
            >
              <div className="font-pixel text-base text-pixel-gold">{s.value}</div>
              <div className="font-pixel text-[8px] text-muted-foreground mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature showcase with screenshots */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline-block font-pixel text-[8px] px-2 py-1 bg-pixel-cyan text-[oklch(0.18_0.08_295)] border-2 border-pixel-purple">
            ✦ THE LOOP
          </div>
          <h2 className="font-pixel text-xl md:text-2xl text-pixel-pink mt-5">
            Quest. Level. Repeat.
          </h2>
          <p className="font-sans text-foreground/70 mt-4 max-w-xl mx-auto">
            Three little dopamine hits stitched together so you actually want to open your planner.
          </p>
        </div>

        <div className="space-y-16">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className={`grid md:grid-cols-2 gap-8 items-center ${
                i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div>
                <div
                  className={`inline-block font-pixel text-[10px] px-2 py-1 border-2 border-pixel-purple text-[oklch(0.18_0.08_295)] ${f.chip}`}
                >
                  {f.icon} {f.title}
                </div>
                <h3 className="font-pixel text-base md:text-lg text-pixel-cyan mt-5">
                  {f.title}
                </h3>
                <p className="font-sans text-foreground/80 mt-4 leading-relaxed">{f.desc}</p>
              </div>
              <div className={`bg-pixel-surface border-2 ${f.border} p-2`}>
                <img
                  src={f.shot}
                  alt={`${f.title} preview`}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="block w-full h-auto"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 border-t-2 border-pixel-purple/40"
      >
        <div className="text-center mb-12">
          <div className="inline-block font-pixel text-[8px] px-2 py-1 bg-pixel-gold text-[oklch(0.18_0.08_295)] border-2 border-pixel-purple">
            ★ PARTY CHAT
          </div>
          <h2 className="font-pixel text-xl md:text-2xl text-pixel-pink mt-5">
            Loved by night-owl students
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-pixel-surface border-2 border-pixel-purple p-5"
            >
              <p className="font-sans text-sm text-foreground/85 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t-2 border-pixel-purple/40">
                <div className="text-2xl">{t.emoji}</div>
                <div>
                  <div className="font-pixel text-[10px] text-pixel-cyan">{t.name}</div>
                  <div className="font-pixel text-[8px] text-muted-foreground mt-1">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-pixel-surface border-4 border-pixel-pink shadow-pixel-pink p-10">
          <div className="text-5xl mb-4">🐉</div>
          <h2 className="font-pixel text-lg md:text-xl text-pixel-cyan">
            Your dragon is waiting.
          </h2>
          <p className="font-sans text-foreground/80 mt-4 max-w-md mx-auto">
            One quest. One XP drop. One streak day. That&apos;s how the legend starts.
          </p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link to="/signup">
              <PixelButton variant="accent" size="lg">
                ▶ Start Free
              </PixelButton>
            </Link>
            <Link to="/changelog">
              <PixelButton variant="ghost" size="lg">
                See what&apos;s new
              </PixelButton>
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 max-w-6xl mx-auto px-6 pb-10 pt-6 flex items-center justify-between flex-wrap gap-3 border-t-2 border-pixel-purple/40">
        <p className="font-pixel text-[8px] text-muted-foreground">
          © PixelQuest — press start to play
        </p>
        <div className="flex gap-4 font-pixel text-[8px] text-muted-foreground">
          <Link to="/changelog" className="hover:text-pixel-cyan">Changelog</Link>
          <Link to="/login" className="hover:text-pixel-cyan">Login</Link>
          <Link to="/signup" className="hover:text-pixel-cyan">Sign up</Link>
        </div>
      </footer>
    </div>
  );
}
