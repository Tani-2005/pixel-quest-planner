import { Link } from "@tanstack/react-router";
import { PixelButton } from "@/components/PixelButton";
import { EmptyState } from "@/components/EmptyState";
import { SubjectTag } from "@/components/SubjectTag";
import { Task } from "@/lib/store";
import { MouseEvent } from "react";

interface Props {
  tasks: Task[];
  onComplete: (id: string, anchor: { x: number; y: number }) => void;
}

export function QuestsPanel({ tasks, onComplete }: Props) {
  const upcoming = tasks
    .filter((t) => t.status !== "Done")
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 3);

  const click = (id: string) => (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onComplete(id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <section className="lg:col-span-2 bg-pixel-surface border-2 border-pixel-purple shadow-pixel p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-pixel text-xs text-pixel-pink">Today&apos;s Quests</h3>
        <Link to="/tasks">
          <PixelButton variant="ghost" size="sm">
            All →
          </PixelButton>
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <EmptyState
          emoji="🗺️"
          title="No active quests"
          message="Your map is clear, hero. Add a quest to start earning XP and evolving your companion."
          cta={
            <Link to="/tasks">
              <PixelButton variant="accent" size="sm">
                + New Quest
              </PixelButton>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {upcoming.map((t) => {
            const overdue = new Date(t.due_date).getTime() < Date.now();
            return (
              <li
                key={t.id}
                className="flex items-center justify-between gap-3 bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-sans font-medium text-sm truncate">{t.title}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <SubjectTag subject={t.subject} />
                    <span
                      className={`font-pixel text-[8px] ${overdue ? "text-pixel-red" : "text-muted-foreground"}`}
                    >
                      {overdue ? "Overdue" : new Date(t.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-[8px] text-pixel-gold">+{t.xp_reward}</span>
                  <PixelButton variant="cyan" size="sm" onClick={click(t.id)}>
                    ✓
                  </PixelButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
