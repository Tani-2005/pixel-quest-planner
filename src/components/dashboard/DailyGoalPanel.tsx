import { DailyGoalRing } from "@/components/DailyGoalRing";
import { StreakCalendar } from "@/components/StreakCalendar";
import { PixelButton } from "@/components/PixelButton";
import { useState } from "react";

interface Props {
  todayXp: number;
  goal: number;
  xpLog: Record<string, number>;
  onSetGoal: (xp: number) => void;
}

export function DailyGoalPanel({ todayXp, goal, xpLog, onSetGoal }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(goal);

  return (
    <section className="bg-pixel-surface border-2 border-pixel-cyan shadow-pixel-cyan p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-pixel text-xs text-pixel-cyan">Daily Quest</h3>
        {!editing ? (
          <PixelButton variant="ghost" size="sm" onClick={() => setEditing(true)}>
            Goal
          </PixelButton>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={draft}
              onChange={(e) => setDraft(parseInt(e.target.value) || 0)}
              className="w-16 bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-2 py-1 font-pixel text-[10px] text-foreground"
            />
            <PixelButton
              variant="cyan"
              size="sm"
              onClick={() => {
                onSetGoal(draft);
                setEditing(false);
              }}
            >
              ✓
            </PixelButton>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <DailyGoalRing todayXp={todayXp} goal={goal} />
        <div className="flex-1 min-w-0 w-full">
          <StreakCalendar xpLog={xpLog} />
        </div>
      </div>
    </section>
  );
}
