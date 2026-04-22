import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HUD } from "@/components/HUD";
import { useGame, petStage, levelFromXp } from "@/lib/store";
import { PetEvolution } from "@/components/PetEvolution";
import { QuestsPanel } from "@/components/dashboard/QuestsPanel";
import { RecentBadgesPanel } from "@/components/dashboard/RecentBadgesPanel";
import { DailyGoalPanel } from "@/components/dashboard/DailyGoalPanel";
import { WeeklyRecapPanel } from "@/components/dashboard/WeeklyRecapPanel";
import { Stat } from "@/components/dashboard/Stat";
import { ToastStack } from "@/components/PixelToast";
import { CompletionBurst } from "@/components/CompletionBurst";
import { LevelUpOverlay } from "@/components/LevelUpOverlay";
import { PixelButton } from "@/components/PixelButton";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { useGlobalNavShortcuts } from "@/hooks/useKeyboardShortcuts";
import { OnboardingTour, type TourStep } from "@/components/OnboardingTour";
import spriteFireball from "@/assets/sprite-fireball.png";
import spriteCrystal from "@/assets/sprite-crystal.png";
import spriteWhale from "@/assets/sprite-whale.png";
import spriteGalaxy from "@/assets/sprite-galaxy.png";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — PixelQuest" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("pixelquest-store");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (!parsed?.state?.authed) throw redirect({ to: "/login" });
        } catch (e) {
          if (e && typeof e === "object" && "to" in e) throw e;
        }
      } else {
        throw redirect({ to: "/login" });
      }
    }
  },
  component: Dashboard,
});

const SPRITES = [spriteFireball, spriteCrystal, spriteWhale, spriteGalaxy];
const SLOTS: Array<{ x: string; y: string; size: number }> = [
  { x: "3%", y: "18%", size: 44 },
  { x: "94%", y: "14%", size: 40 },
  { x: "6%", y: "62%", size: 48 },
  { x: "92%", y: "70%", size: 44 },
];

type Floater = { id: number; src: string; x: string; y: string; size: number };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return { msg: "Burning the midnight oil", emoji: "🌙" };
  if (h < 12) return { msg: "Good morning, hero", emoji: "☀️" };
  if (h < 17) return { msg: "Afternoon grind", emoji: "⚔️" };
  if (h < 21) return { msg: "Evening quest log", emoji: "🌆" };
  return { msg: "Night owl mode", emoji: "🦉" };
}

const TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="hero"]',
    title: "Welcome to PixelQuest",
    body: "This is your hero hub. Your level, daily XP, and pet status all live here.",
    emoji: "👋",
  },
  {
    selector: '[data-tour="quick-actions"]',
    title: "Jump straight in",
    body: "Add a new quest, start a Solo Focus Pomodoro, or join a Study Room — all from one place.",
    emoji: "⚡",
  },
  {
    selector: '[data-tour="daily-goal"]',
    title: "Daily goal ring",
    body: "Earn XP from quests and focus sessions to fill this bar. Hitting it daily builds your streak.",
    emoji: "🎯",
  },
  {
    selector: '[data-tour="pet"]',
    title: "Your pixel companion",
    body: "Your pet evolves as you level up — from Egg, to Hatchling, to Familiar, to Dragon. Keep grinding!",
    emoji: "🥚",
  },
];

function Dashboard() {
  const { user, tasks, badges, xp_log, sessions, completeTask, setDailyGoal } = useGame();
  const pet = petStage(user.level);
  const fb = useGameFeedback();
  useGlobalNavShortcuts();

  const doneCount = tasks.filter((t) => t.status === "Done").length;
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayXp = xp_log[todayKey] ?? 0;
  // Greeting is time-of-day dependent — compute on client only to avoid SSR hydration mismatch.
  const [greeting, setGreeting] = useState<{ msg: string; emoji: string }>({
    msg: "Welcome",
    emoji: "✨",
  });
  useEffect(() => {
    setGreeting(getGreeting());
  }, []);
  const goalPct = Math.min(100, Math.round((todayXp / Math.max(1, user.daily_xp_goal)) * 100));
  const activeQuests = tasks.filter((t) => t.status !== "Done").length;

  const handleComplete = (id: string, anchor: { x: number; y: number }) => {
    fb.handleResult(completeTask(id), anchor);
  };

  // Ambient sprites
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
      }, 3500 + Math.random() * 2000);
    };
    for (let i = 0; i < 2; i++) window.setTimeout(spawn, i * 600);
    const interval = window.setInterval(spawn, 1800);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-background pixel-grid-bg pb-20 md:pb-0 overflow-hidden">
      <HUD />
      <ToastStack items={fb.toasts} />
      <CompletionBurst events={fb.bursts} />
      <LevelUpOverlay
        open={fb.levelUp.open}
        level={fb.levelUp.level}
        onClose={() => fb.setLevelUp({ open: false, level: fb.levelUp.level })}
      />

      {/* Ambient floating sprites */}
      <AnimatePresence>
        {floaters.map((f) => (
          <motion.img
            key={f.id}
            src={f.src}
            alt=""
            aria-hidden
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.5 }}
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

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-10">
        {/* Hero greeting card */}
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-pixel-surface border-4 border-pixel-pink shadow-pixel-pink p-6 md:p-8 overflow-hidden"
          data-tour="hero"
        >
          {/* corner chips */}
          <div className="absolute -top-3 -left-3 font-pixel text-[10px] bg-pixel-cyan text-[oklch(0.18_0.08_295)] px-2 py-1 border-2 border-pixel-purple">
            LVL {user.level}
          </div>
          <div className="absolute -top-3 -right-3 font-pixel text-[10px] bg-pixel-gold text-[oklch(0.18_0.08_295)] px-2 py-1 border-2 border-pixel-purple">
            +{todayXp} XP TODAY
          </div>

          <div className="grid md:grid-cols-[1fr,auto] gap-6 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-block font-pixel text-[8px] px-2 py-1 bg-pixel-purple text-white border-2 border-pixel-pink"
              >
                {greeting.emoji} {greeting.msg.toUpperCase()}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-pixel text-xl md:text-3xl text-pixel-cyan text-shadow-pixel mt-4 leading-tight"
              >
                Welcome back,
                <br />
                {user.username}
                <span className="animate-blink text-pixel-pink">_</span>
              </motion.h1>
              <p className="font-sans text-foreground/80 mt-4 max-w-md">
                Your {pet.name.toLowerCase()} is{" "}
                <span className="text-pixel-pink font-semibold">{pet.stage.toLowerCase()}</span>.{" "}
                {activeQuests > 0
                  ? `${activeQuests} quest${activeQuests === 1 ? "" : "s"} waiting on the map.`
                  : "The map is clear — perfect time to plan a new quest."}
              </p>

              {/* Quick action strip */}
              <div
                className="mt-5 flex flex-wrap items-center gap-2"
                data-tour="quick-actions"
              >
                <Link to="/tasks">
                  <PixelButton variant="accent" size="sm">
                    + New Quest
                  </PixelButton>
                </Link>
                <Link to="/study/solo">
                  <PixelButton variant="cyan" size="sm">
                    ▶ Solo Focus
                  </PixelButton>
                </Link>
                <Link to="/study">
                  <PixelButton variant="secondary" size="sm">
                    Join Room
                  </PixelButton>
                </Link>
              </div>

              {/* Daily goal mini bar */}
              <div className="mt-5 max-w-md" data-tour="daily-goal">
                <div className="flex justify-between font-pixel text-[8px] text-muted-foreground mb-1">
                  <span>DAILY GOAL</span>
                  <span className="text-pixel-gold">
                    {todayXp} / {user.daily_xp_goal} XP
                  </span>
                </div>
                <div className="relative h-3 bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goalPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-pixel-gold"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, oklch(0.82 0.18 90) 0 6px, oklch(0.65 0.16 60) 6px 8px)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Pet showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="relative hidden md:flex items-center justify-center"
              data-tour="pet"
            >
              <div className="absolute inset-0 bg-pixel-pink/20 blur-2xl rounded-full" />
              <div className="relative bg-[oklch(0.14_0.06_295)] border-4 border-pixel-cyan shadow-pixel-cyan p-6 w-44 h-44 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl"
                >
                  {pet.emoji}
                </motion.div>
                <div className="font-pixel text-[10px] text-pixel-cyan mt-3">{user.pet_name}</div>
                <div className="font-pixel text-[7px] text-muted-foreground mt-1">{pet.name}</div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stat strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <Stat label="Total XP" value={user.total_xp} accent="cyan" icon="⚡" delay={0.0} />
          <Stat label="Level" value={levelFromXp(user.total_xp)} accent="pink" icon="🏅" delay={0.05} />
          <Stat label="Tasks Done" value={doneCount} accent="gold" icon="✅" delay={0.1} />
          <Stat label="Streak" value={`${user.streak_count}🔥`} accent="purple" delay={0.15} />
        </motion.div>

        {/* Section: Today */}
        <SectionHeader chip="📜 TODAY" title="Quests & Companion" accent="pink" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-3 gap-6"
        >
          <QuestsPanel tasks={tasks} onComplete={handleComplete} />

          <section className="bg-pixel-surface border-2 border-pixel-pink shadow-pixel-pink p-6">
            <h3 className="font-pixel text-xs text-pixel-cyan mb-5">Pixel Companion</h3>
            <PetEvolution level={user.level} totalXp={user.total_xp} />
            <div className="mt-5 text-center">
              <Link to="/study">
                <span className="font-pixel text-[8px] text-pixel-cyan underline underline-offset-4 hover:text-pixel-pink transition-colors">
                  Train in Study Room →
                </span>
              </Link>
            </div>
          </section>
        </motion.div>

        {/* Section: Progress */}
        <SectionHeader chip="📈 PROGRESS" title="Goals & Recap" accent="cyan" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <DailyGoalPanel
            todayXp={todayXp}
            goal={user.daily_xp_goal}
            xpLog={xp_log}
            onSetGoal={setDailyGoal}
          />
          <WeeklyRecapPanel xpLog={xp_log} sessions={sessions} tasks={tasks} />
        </motion.div>

        {/* Section: Trophies */}
        <SectionHeader chip="🏆 TROPHIES" title="Recent Unlocks" accent="gold" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <RecentBadgesPanel badges={badges} />
        </motion.div>

        {/* Footer rally banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-pixel-surface border-4 border-pixel-purple shadow-pixel p-6 md:p-8 text-center"
        >
          <div className="text-4xl mb-3">{pet.nextEmoji}</div>
          <h3 className="font-pixel text-sm md:text-base text-pixel-cyan">
            {pet.next < 999
              ? `Next form: ${pet.nextEmoji} unlocks at LVL ${pet.next}`
              : "You reached the legendary form!"}
          </h3>
          <p className="font-sans text-foreground/70 mt-3 max-w-md mx-auto">
            One quest. One XP drop. One streak day. That&apos;s how the legend continues.
          </p>
          <div className="mt-5 flex justify-center gap-3 flex-wrap">
            <Link to="/tasks">
              <PixelButton variant="accent" size="sm">
                ▶ Plan a Quest
              </PixelButton>
            </Link>
            <Link to="/leaderboard">
              <PixelButton variant="ghost" size="sm">
                See Ranks
              </PixelButton>
            </Link>
          </div>
        </motion.section>
      </main>

      <OnboardingTour steps={TOUR_STEPS} />
    </div>
  );
}

function SectionHeader({
  chip,
  title,
  accent,
}: {
  chip: string;
  title: string;
  accent: "pink" | "cyan" | "gold";
}) {
  const accentMap = {
    pink: { bg: "bg-pixel-pink", text: "text-pixel-pink" },
    cyan: { bg: "bg-pixel-cyan", text: "text-pixel-cyan" },
    gold: { bg: "bg-pixel-gold", text: "text-pixel-gold" },
  } as const;
  const a = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <div
        className={`font-pixel text-[8px] px-2 py-1 ${a.bg} text-[oklch(0.18_0.08_295)] border-2 border-pixel-purple`}
      >
        {chip}
      </div>
      <h2 className={`font-pixel text-sm md:text-base ${a.text}`}>{title}</h2>
      <div className="flex-1 h-0.5 bg-pixel-purple/40" />
    </motion.div>
  );
}
