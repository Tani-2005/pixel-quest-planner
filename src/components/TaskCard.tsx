import { Task } from "@/lib/store";
import { PixelButton } from "./PixelButton";

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
}: {
  task: Task;
  onComplete: (id: string) => void;
}) {
  const isDone = task.status === "Done";
  const overdue = !isDone && new Date(task.due_date).getTime() < Date.now();

  return (
    <div
      className={`relative bg-pixel-surface border-2 border-pixel-purple shadow-pixel-sm border-l-[6px] ${
        priorityBorder[task.priority]
      } p-4 flex flex-col gap-3 ${overdue ? "bg-[oklch(0.22_0.13_25)]" : ""} ${
        isDone ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className={`font-pixel text-[8px] px-2 py-1 border border-pixel-purple ${typeColor[task.type]}`}
            >
              {task.type}
            </span>
            <span className="font-pixel text-[8px] text-muted-foreground">{task.subject}</span>
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
            <PixelButton variant="cyan" size="sm" onClick={() => onComplete(task.id)}>
              ✅ Complete
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
}
