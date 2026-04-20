import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

interface Shortcut {
  key: string;
  handler: () => void;
  meta?: boolean;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      const match = shortcuts.find(
        (s) => s.key.toLowerCase() === e.key.toLowerCase() && (!s.meta || e.metaKey || e.ctrlKey),
      );
      if (match) {
        e.preventDefault();
        match.handler();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcuts]);
}

export function useGlobalNavShortcuts() {
  const navigate = useNavigate();
  useKeyboardShortcuts([
    { key: "g", handler: () => navigate({ to: "/dashboard" }) },
    { key: "t", handler: () => navigate({ to: "/tasks" }) },
    { key: "s", handler: () => navigate({ to: "/study" }) },
    { key: "b", handler: () => navigate({ to: "/badges" }) },
    { key: ",", handler: () => navigate({ to: "/settings" }) },
  ]);
}
