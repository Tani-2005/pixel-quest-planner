import { useCallback, useEffect, useState } from "react";
import { ToastItem } from "@/components/PixelToast";
import { BurstEvent } from "@/components/CompletionBurst";
import { BADGES, useGame } from "@/lib/store";
import { sfx, setMuted } from "@/lib/sound";

export function useGameFeedback() {
  const { user } = useGame();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [bursts, setBursts] = useState<BurstEvent[]>([]);
  const [levelUp, setLevelUp] = useState<{ open: boolean; level: number }>({
    open: false,
    level: 1,
  });

  // Keep sound mute flag in sync with persisted user preference
  useEffect(() => {
    setMuted(!user.sound_enabled);
  }, [user.sound_enabled]);

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
      sfx.taskComplete();
      if (result.leveledUp) {
        setLevelUp({ open: true, level: result.newLevel });
        setTimeout(() => sfx.levelUp(), 150);
      }
      result.newBadges.forEach((key, i) => {
        const meta = BADGES.find((b) => b.key === key);
        if (!meta) return;
        pushToast({
          id: crypto.randomUUID(),
          message: `🏅 BADGE: ${meta.name}`,
          variant: "badge",
        });
        setTimeout(() => sfx.badge(), 250 + i * 200);
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
