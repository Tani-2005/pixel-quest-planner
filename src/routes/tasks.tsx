import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HUD } from "@/components/HUD";
import { TaskCard } from "@/components/TaskCard";
import { PixelButton } from "@/components/PixelButton";
import { ToastStack, ToastItem } from "@/components/PixelToast";
import { LevelUpOverlay } from "@/components/LevelUpOverlay";
import { useGame, BADGES, Priority, TaskType, XP_BY_PRIORITY } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks — PixelQuest" }] }),
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("pixelquest-store");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!parsed?.state?.authed) throw redirect({ to: "/login" });
      } else throw redirect({ to: "/login" });
    }
  },
  component: TasksPage,
});

const TYPES: ("All" | TaskType)[] = ["All", "Homework", "Exam", "Project", "Club Task", "Personal"];

function TasksPage() {
  const { tasks, completeTask, addTask } = useGame();
  const [filter, setFilter] = useState<"All" | TaskType>("All");
  const [drawer, setDrawer] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [levelUp, setLevelUp] = useState<{ open: boolean; level: number }>({
    open: false,
    level: 1,
  });

  const filtered = useMemo(() => {
    const list = filter === "All" ? tasks : tasks.filter((t) => t.type === filter);
    return [...list].sort((a, b) => {
      if (a.status === "Done" && b.status !== "Done") return 1;
      if (b.status === "Done" && a.status !== "Done") return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  }, [tasks, filter]);

  const pushToast = (t: ToastItem) => {
    setToasts((s) => [...s, t]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== t.id)), 2200);
  };

  const handleComplete = (id: string) => {
    const result = completeTask(id);
    if (!result) return;
    pushToast({ id: crypto.randomUUID(), message: `+${result.gainedXp} XP ⚡`, variant: "xp" });
    if (result.leveledUp) {
      setLevelUp({ open: true, level: result.newLevel });
    }
    result.newBadges.forEach((key) => {
      const meta = BADGES.find((b) => b.key === key);
      if (!meta) return;
      pushToast({
        id: crypto.randomUUID(),
        message: `🏅 BADGE UNLOCKED: ${meta.name}`,
        variant: "badge",
      });
    });
  };

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-8">
      <HUD />
      <ToastStack items={toasts} />
      <LevelUpOverlay
        open={levelUp.open}
        level={levelUp.level}
        onClose={() => setLevelUp({ open: false, level: levelUp.level })}
      />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="font-pixel text-base md:text-lg text-pixel-cyan">Quest Log</h1>
            <p className="font-pixel text-[8px] text-muted-foreground mt-2">
              Complete missions to earn XP
            </p>
          </div>
          <PixelButton variant="accent" onClick={() => setDrawer(true)}>
            + New Quest
          </PixelButton>
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`font-pixel text-[8px] px-3 py-2 border-2 ${
                filter === t
                  ? "bg-pixel-purple text-white border-pixel-pink"
                  : "border-pixel-purple text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-pixel-surface border-2 border-pixel-purple shadow-pixel p-12 text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="font-pixel text-xs text-muted-foreground">
              No quests found, hero. Add your first mission!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((t) => (
              <TaskCard key={t.id} task={t} onComplete={handleComplete} />
            ))}
          </div>
        )}
      </main>

      <NewTaskDrawer open={drawer} onClose={() => setDrawer(false)} onSave={addTask} />
    </div>
  );
}

function NewTaskDrawer({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: ReturnType<typeof useGame.getState>["addTask"];
}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<TaskType>("Homework");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [due, setDue] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 16);
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onSave({
      title,
      subject: subject || "—",
      type,
      priority,
      due_date: new Date(due).toISOString(),
      xp_reward: XP_BY_PRIORITY[priority],
    });
    setTitle("");
    setSubject("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[150]"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-pixel-surface border-l-2 border-pixel-pink z-[160] overflow-y-auto"
          >
            <form onSubmit={submit} className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-pixel text-sm text-pixel-cyan">New Quest</h2>
                <PixelButton type="button" variant="ghost" size="sm" onClick={onClose}>
                  ✕
                </PixelButton>
              </div>

              <Input label="Title" value={title} onChange={setTitle} required />
              <Input label="Subject" value={subject} onChange={setSubject} placeholder="MATH 210" />

              <div>
                <div className="font-pixel text-[8px] text-pixel-cyan mb-2">Type</div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TaskType)}
                  className="w-full bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-3 font-sans text-foreground focus:outline-none focus:border-pixel-pink"
                >
                  {(["Homework", "Exam", "Project", "Club Task", "Personal"] as TaskType[]).map(
                    (x) => (
                      <option key={x}>{x}</option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <div className="font-pixel text-[8px] text-pixel-cyan mb-2">Priority</div>
                <div className="grid grid-cols-3 gap-2">
                  {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`font-pixel text-[8px] py-3 border-2 ${
                        priority === p
                          ? p === "High"
                            ? "bg-pixel-red text-white border-pixel-purple"
                            : p === "Medium"
                              ? "bg-pixel-gold text-[oklch(0.18_0.08_295)] border-pixel-purple"
                              : "bg-pixel-cyan text-[oklch(0.18_0.08_295)] border-pixel-purple"
                          : "border-pixel-purple text-muted-foreground"
                      }`}
                    >
                      {p}
                      <div className="text-[7px] mt-1 opacity-70">+{XP_BY_PRIORITY[p]} XP</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-pixel text-[8px] text-pixel-cyan mb-2">Due Date</div>
                <input
                  type="datetime-local"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="w-full bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-3 font-sans text-foreground focus:outline-none focus:border-pixel-pink"
                />
              </div>

              <PixelButton type="submit" variant="accent" className="w-full" size="lg">
                ▶ Add Quest
              </PixelButton>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="font-pixel text-[8px] text-pixel-cyan mb-2">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-3 font-sans text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-pixel-pink"
      />
    </label>
  );
}
