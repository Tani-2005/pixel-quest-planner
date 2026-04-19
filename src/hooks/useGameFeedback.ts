import { useCallback, useState } from "react";
import { ToastItem } from "@/components/PixelToast";
import { BurstEvent } from "@/components/CompletionBurst";
import { BADGES } from "@/lib/store";

export function useGameFeedback() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [bursts, setBursts] = useState<BurstEvent[]>([]);
  const [levelUp, setLevelUp] = useState<{ open: boolean; level: number }>({
    open: false,
    level: 1,
  });

  const pushToast = useCallback((t: ToastItem) => {
    setToasts((s) => [...s, t]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== t.id)), 2200);
  }, []);

  const pushBurst = useCallback((b: BurstEvent) => {
    setBursts((s) => [...s, b]);
    setTimeout(() => setBursts((s) => s.filter((x) => x.id !== b.id)), 1300);
  }, []);

  const handleResult = useCallback(
    (
      result: { gainedXp: number; leveledUp: boolean; newLevel: number; newBadges: string[] } | null,
      anchor?: { x: number; y: number },
    ) => {
      if (!result) return;
      pushBurst({ id: crypto.randomUUID(), xp: result.gainedXp, x: anchor?.x, y: anchor?.y });
      pushToast({ id: crypto.randomUUID(), message: `+${result.gainedXp} XP ⚡`, variant: "xp" });
      if (result.leveledUp) {
        setLevelUp({ open: true, level: result.newLevel });
      }
      result.newBadges.forEach((key) => {
        const meta = BADGES.find((b) => b.key === key);
        if (!meta) return;
        pushToast({
          id: crypto.randomUUID(),
          message: `🏅 BADGE: ${meta.name}`,
          variant: "badge",
        });
      });
    },
    [pushBurst, pushToast],
  );

  return {
    toasts,
    bursts,
    levelUp,
    setLevelUp,
    pushToast,
    pushBurst,
    handleResult,
  };
}
