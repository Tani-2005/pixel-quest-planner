import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PixelButton } from "@/components/PixelButton";

export const Route = createFileRoute("/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — PixelQuest" },
      {
        name: "description",
        content: "What's new in PixelQuest: study rooms, pet evolution, leaderboards, sound design and more.",
      },
      { property: "og:title", content: "PixelQuest Changelog" },
      {
        property: "og:description",
        content: "Patch notes, new quests, and pet evolutions shipping into PixelQuest.",
      },
    ],
  }),
  component: Changelog,
});

type Entry = {
  version: string;
  date: string;
  tag: "feature" | "polish" | "fix";
  title: string;
  bullets: string[];
};

const ENTRIES: Entry[] = [
  {
    version: "v0.4",
    date: "Apr 21, 2026",
    tag: "feature",
    title: "Study Rooms 2.0 + Friends",
    bullets: [
      "Create your own room — pick name, subject, emoji, and timer length.",
      "Persistent cheer chat & one-tap emoji reactions inside rooms.",
      "Friends list with online status and weekly focus minutes.",
      "Weekly leaderboard ranks you against your party.",
      "Shareable invite link for every room.",
    ],
  },
  {
    version: "v0.3",
    date: "Apr 18, 2026",
    tag: "feature",
    title: "Polish & Depth",
    bullets: [
      "Pet customization: name your pet and pick a hat (crown, wizard, cap, halo).",
      "Quest difficulty tiers — Easy, Medium, Epic — with XP multipliers.",
      "Weekly recap chart on the dashboard.",
      "Chiptune sound design + sound toggle in Settings.",
      "Keyboard shortcuts: G dashboard · T tasks · S study · N new quest.",
    ],
  },
  {
    version: "v0.2",
    date: "Apr 14, 2026",
    tag: "polish",
    title: "Tasks UX",
    bullets: [
      "Subject color tags + filter chips.",
      "Drag-to-reorder your quest list.",
      "Recurring quests (daily / weekly).",
      "Calendar week-view toggle.",
    ],
  },
  {
    version: "v0.1",
    date: "Apr 10, 2026",
    tag: "feature",
    title: "Hello, world",
    bullets: [
      "Tasks → XP loop with early-bird bonus.",
      "Pet evolution: egg → hatchling → familiar → dragon.",
      "Daily streaks + daily XP goal ring.",
      "Solo Pomodoro focus timer.",
      "Badges and level-up overlay.",
    ],
  },
];

const TAG_STYLES: Record<Entry["tag"], string> = {
  feature: "bg-pixel-pink text-white",
  polish: "bg-pixel-cyan text-[oklch(0.18_0.08_295)]",
  fix: "bg-pixel-gold text-[oklch(0.18_0.08_295)]",
};

function Changelog() {
  return (
    <div className="min-h-screen bg-background pixel-grid-bg">
      <header className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl">👾</span>
          <span className="font-pixel text-[10px] text-pixel-cyan">PixelQuest</span>
        </Link>
        <div className="flex gap-2">
          <Link to="/login">
            <PixelButton variant="ghost" size="sm">Login</PixelButton>
          </Link>
          <Link to="/signup">
            <PixelButton variant="accent" size="sm">Start Quest →</PixelButton>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-6 pb-14"
        >
          <div className="inline-block font-pixel text-[8px] px-2 py-1 bg-pixel-gold text-[oklch(0.18_0.08_295)] border-2 border-pixel-purple">
            ✦ PATCH NOTES
          </div>
          <h1 className="font-pixel text-2xl md:text-3xl text-pixel-cyan text-shadow-pixel mt-5">
            Changelog
          </h1>
          <p className="font-sans text-foreground/70 mt-4">
            Every quest, fix, and pet evolution we&apos;ve shipped.
          </p>
        </motion.div>

        <ol className="relative border-l-2 border-pixel-purple ml-3 space-y-10">
          {ENTRIES.map((e, i) => (
            <motion.li
              key={e.version}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="pl-6 relative"
            >
              <span className="absolute -left-[9px] top-2 w-4 h-4 bg-pixel-pink border-2 border-pixel-purple" />
              <div className="bg-pixel-surface border-2 border-pixel-purple shadow-pixel p-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-pixel text-xs text-pixel-cyan">{e.version}</span>
                  <span
                    className={`font-pixel text-[8px] px-2 py-1 border-2 border-pixel-purple ${TAG_STYLES[e.tag]}`}
                  >
                    {e.tag.toUpperCase()}
                  </span>
                  <span className="font-pixel text-[8px] text-muted-foreground ml-auto">{e.date}</span>
                </div>
                <h2 className="font-pixel text-sm text-pixel-pink mt-4">{e.title}</h2>
                <ul className="font-sans text-sm text-foreground/85 mt-4 space-y-2">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-pixel-gold">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>

        <div className="mt-14 text-center">
          <Link to="/signup">
            <PixelButton variant="accent" size="lg">
              ▶ Try the latest build
            </PixelButton>
          </Link>
        </div>
      </main>
    </div>
  );
}
