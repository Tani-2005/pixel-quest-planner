import { Task, subjectColor } from "@/lib/store";
import { PixelButton } from "./PixelButton";
import { SubjectTag } from "./SubjectTag";
import { DifficultyChip } from "./DifficultyChip";
import { MouseEvent } from "react";

const priorityBorder: Record<string, string> = {
  High: "border-l-pixel-red",
  Medium: "border-l-pixel-gold",
  Low: "border-l-pixel-cyan",
};

const typeColor: Record<string, string> = {
  Homework: "bg-pixel-cyan text-[oklch(0.18_0.08_295)]",
  Exam: "bg-pixel-red text-white",
  Project: "bg-pixel-pink text-white",
  "Club Task": "bg-pixel-gold text-[oklch(0.18_0.08_295)]",
  Personal: "bg-pixel-purple text-white",
};

const subjectStripe: Record<string, string> = {
  "pixel-cyan": "bg-pixel-cyan",
  "pixel-pink": "bg-pixel-pink",
  "pixel-gold": "bg-pixel-gold",
  "pixel-green": "bg-pixel-green",
  "pixel-purple": "bg-pixel-purple",
  "pixel-red": "bg-pixel-red",
};

function fmtDue(due: string) {
  const d = new Date(due);
  const now = new Date();
  const diffH = (d.getTime() - now.getTime()) / 36e5;
  if (diffH < 0) return `Overdue ${Math.ceil(-diffH)}h`;
  if (diffH < 24) return `Due in ${Math.ceil(diffH)}h`;
  return `Due ${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export function TaskCard({
  task,
  onComplete,
  dragHandle,
}: {
  task: Task;
  onComplete: (id: string, anchor: { x: number; y: number }) => void;
  dragHandle?: React.ReactNode;
}) {
  const isDone = task.status === "Done";
  const overdue = !isDone && new Date(task.due_date).getTime() < Date.now();
  const stripe = subjectStripe[subjectColor(task.subject)];

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onComplete(task.id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div
      className={`relative bg-pixel-surface border-2 border-pixel-purple shadow-pixel-sm border-l-[6px] ${
        priorityBorder[task.priority]
      } p-4 flex flex-col gap-3 ${overdue ? "bg-[oklch(0.22_0.13_25)]" : ""} ${
        isDone ? "opacity-60" : ""
      }`}
    >
      {/* subject color stripe along the top */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${stripe}`} aria-hidden />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {dragHandle}
            <span
              className={`font-pixel text-[8px] px-2 py-1 border border-pixel-purple ${typeColor[task.type]}`}
            >
              {task.type}
            </span>
            <SubjectTag subject={task.subject} />
            {task.recurrence !== "none" && (
              <span className="font-pixel text-[8px] px-2 py-1 border border-pixel-green text-pixel-green">
                ↻ {task.recurrence}
              </span>
            )}
            <DifficultyChip difficulty={task.difficulty} />
            {overdue && <span className="font-pixel text-[8px] text-pixel-red">☠️ OVERDUE</span>}
          </div>
          <h3 className="font-sans font-semibold text-base text-foreground break-words">
            {isDone && "✓ "}
            {task.title}
          </h3>
          <div className="font-pixel text-[8px] text-muted-foreground mt-2">
            {fmtDue(task.due_date)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="font-pixel text-[10px] text-pixel-gold whitespace-nowrap">
            +{task.xp_reward} XP
          </span>
          {!isDone && (
            <PixelButton variant="cyan" size="sm" onClick={onClick}>
              ✅ Complete
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
}
