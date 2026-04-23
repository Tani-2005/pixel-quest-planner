import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth-guard";
import { useMemo, useState } from "react";
import { HUD } from "@/components/HUD";
import { PixelButton } from "@/components/PixelButton";
import { ToastStack } from "@/components/PixelToast";
import { LevelUpOverlay } from "@/components/LevelUpOverlay";
import { CompletionBurst } from "@/components/CompletionBurst";
import { EmptyState } from "@/components/EmptyState";
import { TasksSortableList } from "@/components/TasksSortableList";
import { TasksWeekGrid } from "@/components/TasksWeekGrid";
import { SubjectTag } from "@/components/SubjectTag";
import {
  useGame,
  Priority,
  Recurrence,
  TaskType,
  Difficulty,
  xpForTask,
} from "@/lib/store";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { useGlobalNavShortcuts, useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { AnimatePresence, motion } from "framer-motion";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Quest Log — PixelQuest" },
      { name: "description", content: "Manage your quests, reorder them, and track recurring missions." },
    ],
  }),
  beforeLoad: requireAuth,
  component: TasksPage,
});

const TYPES: ("All" | TaskType)[] = ["All", "Homework", "Exam", "Project", "Club Task", "Personal"];

function TasksPage() {
  const { tasks, completeTask, addTask, reorderTasks } = useGame();
  const [filter, setFilter] = useState<"All" | TaskType>("All");
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "week">("list");
  const [drawer, setDrawer] = useState(false);
  const fb = useGameFeedback();
  useGlobalNavShortcuts();
  useKeyboardShortcuts([{ key: "n", handler: () => setDrawer(true) }]);

  const subjects = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.subject))).filter(Boolean);
  }, [tasks]);

  const filtered = useMemo(() => {
    let list = filter === "All" ? tasks : tasks.filter((t) => t.type === filter);
    if (subjectFilter) list = list.filter((t) => t.subject === subjectFilter);
    return [...list].sort((a, b) => {
      if (a.status === "Done" && b.status !== "Done") return 1;
      if (b.status === "Done" && a.status !== "Done") return -1;
      // honor manual order first, then due date
      const orderDiff = (a.order ?? 0) - (b.order ?? 0);
      if (orderDiff !== 0) return orderDiff;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  }, [tasks, filter, subjectFilter]);

  const handleComplete = (id: string, anchor: { x: number; y: number }) => {
    fb.handleResult(completeTask(id), anchor);
  };

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-8">
      <HUD />
      <ToastStack items={fb.toasts} />
      <CompletionBurst events={fb.bursts} />
      <LevelUpOverlay
        open={fb.levelUp.open}
        level={fb.levelUp.level}
        onClose={() => fb.setLevelUp({ open: false, level: fb.levelUp.level })}
      />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="font-pixel text-base md:text-lg text-pixel-cyan">Quest Log</h1>
            <p className="font-pixel text-[8px] text-muted-foreground mt-2">
              Drag to reorder · Recurring quests respawn on completion
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border-2 border-pixel-purple">
              <button
                onClick={() => setView("list")}
                className={`font-pixel text-[8px] px-3 py-2 ${
                  view === "list" ? "bg-pixel-purple text-white" : "text-muted-foreground"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView("week")}
                className={`font-pixel text-[8px] px-3 py-2 ${
                  view === "week" ? "bg-pixel-purple text-white" : "text-muted-foreground"
                }`}
              >
                Week
              </button>
            </div>
            <PixelButton variant="accent" onClick={() => setDrawer(true)}>
              + New Quest
            </PixelButton>
          </div>
        </div>

        {/* type filters */}
        <div className="flex flex-wrap gap-2 mb-3">
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

        {/* subject chips */}
        {subjects.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="font-pixel text-[8px] text-muted-foreground mr-1">Subject:</span>
            <button
              onClick={() => setSubjectFilter(null)}
              className={`font-pixel text-[8px] px-2 py-1 border ${
                subjectFilter === null
                  ? "bg-pixel-purple text-white border-pixel-pink"
                  : "border-pixel-purple text-muted-foreground"
              }`}
            >
              All
            </button>
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setSubjectFilter(subjectFilter === s ? null : s)}
                className={subjectFilter === s ? "ring-2 ring-pixel-pink" : ""}
              >
                <SubjectTag subject={s} />
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            emoji="🗺️"
            title="No quests found"
            message="Your quest log is empty. Add a mission to start earning XP."
            cta={
              <PixelButton variant="accent" onClick={() => setDrawer(true)}>
                + New Quest
              </PixelButton>
            }
          />
        ) : view === "list" ? (
          <TasksSortableList
            tasks={filtered}
            onComplete={handleComplete}
            onReorder={reorderTasks}
          />
        ) : (
          <TasksWeekGrid tasks={filtered} onComplete={handleComplete} />
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
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [recurrence, setRecurrence] = useState<Recurrence>("none");
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
      xp_reward: xpForTask(priority, difficulty),
      recurrence,
      difficulty,
    });
    setTitle("");
    setSubject("");
    setRecurrence("none");
    setDifficulty("Medium");
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
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-pixel text-[8px] text-pixel-cyan mb-2 flex items-center justify-between">
                  <span>Difficulty</span>
                  <span className="text-pixel-gold">+{xpForTask(priority, difficulty)} XP</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["Easy", "Medium", "Epic"] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`font-pixel text-[8px] py-3 border-2 ${
                        difficulty === d
                          ? d === "Easy"
                            ? "bg-pixel-green text-[oklch(0.18_0.08_295)] border-pixel-purple"
                            : d === "Medium"
                              ? "bg-pixel-gold text-[oklch(0.18_0.08_295)] border-pixel-purple"
                              : "bg-pixel-pink text-white border-pixel-purple"
                          : "border-pixel-purple text-muted-foreground"
                      }`}
                    >
                      {d === "Easy" ? "🟢" : d === "Medium" ? "🟡" : "🔥"} {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-pixel text-[8px] text-pixel-cyan mb-2">Recurrence</div>
                <div className="grid grid-cols-3 gap-2">
                  {(["none", "daily", "weekly"] as Recurrence[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRecurrence(r)}
                      className={`font-pixel text-[8px] py-3 border-2 ${
                        recurrence === r
                          ? "bg-pixel-green text-[oklch(0.18_0.08_295)] border-pixel-purple"
                          : "border-pixel-purple text-muted-foreground"
                      }`}
                    >
                      {r === "none" ? "One-off" : `↻ ${r}`}
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
