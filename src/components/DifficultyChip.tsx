import { Difficulty, DIFFICULTY_META } from "@/lib/store";

export function DifficultyChip({ difficulty }: { difficulty: Difficulty }) {
  const meta = DIFFICULTY_META[difficulty];
  return (
    <span className={`font-pixel text-[7px] ${meta.color} flex items-center gap-1`}>
      <span aria-hidden>{meta.emoji}</span>
      {difficulty.toUpperCase()}
    </span>
  );
}
