import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PixelButton } from "@/components/PixelButton";

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

const FLOATERS = [
  { emoji: "🥚", x: "8%", y: "20%", delay: 0, scale: 1 },
  { emoji: "⚔️", x: "85%", y: "16%", delay: 0.4, scale: 0.9 },
  { emoji: "🐉", x: "12%", y: "70%", delay: 0.8, scale: 1.1 },
  { emoji: "💎", x: "82%", y: "62%", delay: 0.2, scale: 0.85 },
  { emoji: "🍄", x: "50%", y: "8%", delay: 1.0, scale: 0.7 },
];

const ASCII = `
  :xx;                                          M     M
  XMM0                              :.MW         M
                                    :MMW
  OMMx   .MMM     XMMc  :MM@   .dXMMMMMK1   ,0.WMMMMW,
  OMMx   .MMM     XMMc  :MM.  W .MN;  .cW.X  M:M.    '
  OMMx   .MMM     XMM.  :MMW  OMMNKKKWKWMM:  lXMMWNKOo.
  OMMx   .MMMc   :cMMc  :MMW  .MMN,.  ...M    .';dMM.W
  OMMx   1WMMW.WMWMMc   :MMW   :XMMNK.NMN.   .N.N0O.NMW0
  0MMd      ,clc, .::.   .::;     ..ccK:'      .'.clcM'
  KKXMMX.                                              l   o
  ;cl:'         .       ,                              M
                  M       An Autonomous Quest          :
                                  :
                d                                       l
`;

function Landing() {
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

      {/* Floating sprites */}
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          className={i % 2 === 0 ? "animate-float-bob" : "animate-float-bob-slow"}
          style={{
            position: "absolute",
            left: f.x,
            top: f.y,
            fontSize: `${2.5 * f.scale}rem`,
            animationDelay: `${f.delay}s`,
            opacity: 0.85,
            zIndex: 1,
          }}
        >
          {f.emoji}
        </div>
      ))}

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-12 md:pt-20 pb-24 text-center">
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 1.2 }}
          className="hidden md:block font-pixel text-[8px] leading-[1.1] text-pixel-pink whitespace-pre mx-auto select-none"
        >
          {ASCII}
        </motion.pre>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-pixel text-3xl sm:text-5xl md:text-6xl text-pixel-cyan text-shadow-pixel mt-6"
        >
          PixelQuest
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-pixel text-[10px] sm:text-xs text-muted-foreground mt-6 max-w-xl mx-auto"
        >
          A Gamified Student Planner<span className="animate-blink">_</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="font-sans text-base sm:text-lg text-foreground/80 mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          Turn homework into quests. Earn XP, evolve your pixel pet, keep your streak alive,
          and study side-by-side with friends in real time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
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
