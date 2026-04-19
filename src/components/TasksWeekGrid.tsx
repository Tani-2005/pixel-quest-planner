import { Task, subjectColor } from "@/lib/store";
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  isToday,
} from "date-fns";
import { MouseEvent } from "react";

const subjectBg: Record<string, string> = {
  "pixel-cyan": "bg-pixel-cyan/20 border-l-pixel-cyan",
  "pixel-pink": "bg-pixel-pink/20 border-l-pixel-pink",
  "pixel-gold": "bg-pixel-gold/20 border-l-pixel-gold",
  "pixel-green": "bg-pixel-green/20 border-l-pixel-green",
  "pixel-purple": "bg-pixel-purple/20 border-l-pixel-purple",
  "pixel-red": "bg-pixel-red/20 border-l-pixel-red",
};

interface Props {
  tasks: Task[];
  onComplete: (id: string, anchor: { x: number; y: number }) => void;
}

export function TasksWeekGrid({ tasks, onComplete }: Props) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const click = (id: string) => (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onComplete(id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
      {days.map((d) => {
        const dayTasks = tasks.filter((t) => isSameDay(new Date(t.due_date), d));
        const today = isToday(d);
        return (
          <div
            key={d.toISOString()}
            className={`bg-pixel-surface border-2 ${
              today ? "border-pixel-cyan shadow-pixel-cyan" : "border-pixel-purple"
            } p-3 min-h-[160px]`}
          >
            <div
              className={`font-pixel text-[8px] mb-2 ${
                today ? "text-pixel-cyan" : "text-muted-foreground"
              }`}
            >
              {format(d, "EEE").toUpperCase()} {format(d, "d")}
            </div>
            {dayTasks.length === 0 ? (
              <div className="font-pixel text-[8px] text-muted-foreground/50 mt-4 text-center">
                —
              </div>
            ) : (
              <ul className="space-y-2">
                {dayTasks.map((t) => {
                  const sc = subjectBg[subjectColor(t.subject)];
                  const done = t.status === "Done";
                  return (
                    <li
                      key={t.id}
                      className={`relative ${sc} border border-pixel-purple border-l-[4px] p-2 ${
                        done ? "opacity-50" : ""
                      }`}
                    >
                      <div className="font-sans text-xs font-medium truncate">
                        {done && "✓ "}
                        {t.title}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-pixel text-[7px] text-muted-foreground">
                          {t.subject}
                        </span>
                        {!done && (
                          <button
                            onClick={click(t.id)}
                            className="font-pixel text-[8px] text-pixel-cyan hover:text-pixel-pink"
                            title="Complete"
                          >
                            +{t.xp_reward}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
