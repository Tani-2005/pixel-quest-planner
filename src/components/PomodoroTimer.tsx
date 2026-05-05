import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PixelButton } from "./PixelButton";
import { sfx } from "@/lib/sound";

type Phase = "work" | "break";

interface Props {
  workMinutes?: number;
  breakMinutes?: number;
  onSessionComplete: (minutes: number) => void;
  accent?: "pink" | "cyan" | "gold";
  /** When this counter increments, force-end the current session. */
  endSignal?: number;
  /** Hide the inline duration inputs (host controls only). */
  lockDurations?: boolean;
}

const accentClasses = {
  pink: "text-pixel-pink",
  cyan: "text-pixel-cyan",
  gold: "text-pixel-gold",
} as const;

export function PomodoroTimer({
  workMinutes: initialWork = 25,
  breakMinutes: initialBreak = 5,
  onSessionComplete,
  accent = "pink",
  endSignal = 0,
  lockDurations = false,
}: Props) {
  const [workMinutes, setWorkMinutes] = useState(initialWork);
  const [breakMinutes, setBreakMinutes] = useState(initialBreak);
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsLeft, setSecondsLeft] = useState(initialWork * 60);
  const [running, setRunning] = useState(false);
  const startedAtRef = useRef<number | null>(null);

  // Sync external duration changes (host editing room timer)
  useEffect(() => setWorkMinutes(initialWork), [initialWork]);
  useEffect(() => setBreakMinutes(initialBreak), [initialBreak]);

  // reset when phase or durations change while not running
  useEffect(() => {
    if (running) return;
    setSecondsLeft((phase === "work" ? workMinutes : breakMinutes) * 60);
  }, [workMinutes, breakMinutes, phase, running]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          sfx.pomodoroEnd();
          if (phase === "work") {
            onSessionComplete(workMinutes);
            setPhase("break");
            startedAtRef.current = null;
            return breakMinutes * 60;
          } else {
            setPhase("work");
            startedAtRef.current = Date.now();
            return workMinutes * 60;
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running, phase, workMinutes, breakMinutes, onSessionComplete]);

  // Host-driven end-of-session
  const lastEndRef = useRef(endSignal);
  useEffect(() => {
    if (endSignal === lastEndRef.current) return;
    lastEndRef.current = endSignal;
    if (phase === "work") {
      const total = workMinutes * 60;
      const completed = Math.max(1, Math.floor((total - secondsLeft) / 60));
      onSessionComplete(completed);
    }
    setRunning(false);
    setPhase("work");
    setSecondsLeft(workMinutes * 60);
    startedAtRef.current = null;
  }, [endSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    if (!running && startedAtRef.current === null) startedAtRef.current = Date.now();
    if (!running) sfx.pomodoroStart();
    setRunning((r) => !r);
  };

  const skip = () => {
    if (phase === "work" && running) {
      const total = workMinutes * 60;
      const completed = Math.max(1, Math.floor((total - secondsLeft) / 60));
      onSessionComplete(completed);
    }
    setRunning(false);
    setPhase((p) => (p === "work" ? "break" : "work"));
    startedAtRef.current = null;
  };

  const reset = () => {
    setRunning(false);
    setPhase("work");
    setSecondsLeft(workMinutes * 60);
    startedAtRef.current = null;
  };

  const total = (phase === "work" ? workMinutes : breakMinutes) * 60;
  const pct = ((total - secondsLeft) / total) * 100;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="text-center">
      <div className="font-pixel text-[10px] text-muted-foreground mb-3">
        {phase === "work" ? "🎯 FOCUS" : "☕ BREAK"}
      </div>
      <motion.div
        key={phase}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className={`font-pixel text-6xl md:text-7xl ${accentClasses[accent]} text-shadow-pixel`}
      >
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </motion.div>

      <div className="mt-6 w-full h-3 bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple overflow-hidden">
        <motion.div
          className={`h-full ${
            phase === "work" ? "bg-pixel-pink" : "bg-pixel-cyan"
          }`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "linear" }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <PixelButton variant={running ? "ghost" : "accent"} onClick={toggle} size="lg">
          {running ? "⏸ Pause" : secondsLeft === total ? "▶ Start" : "▶ Resume"}
        </PixelButton>
        <PixelButton variant="ghost" onClick={skip}>
          ⏭ Skip
        </PixelButton>
        <PixelButton variant="ghost" onClick={reset}>
          ↺ Reset
        </PixelButton>
      </div>

      {!lockDurations && (
        <div className="mt-6 flex flex-wrap justify-center gap-4 font-pixel text-[8px] text-muted-foreground">
          <label className="flex items-center gap-2">
            Work
            <input
              type="number"
              min={5}
              max={120}
              value={workMinutes}
              onChange={(e) => setWorkMinutes(Math.max(5, parseInt(e.target.value) || 5))}
              disabled={running}
              className="w-12 bg-[oklch(0.14_0.06_295)] border border-pixel-purple px-1 py-0.5 text-foreground disabled:opacity-50"
            />
            min
          </label>
          <label className="flex items-center gap-2">
            Break
            <input
              type="number"
              min={1}
              max={30}
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={running}
              className="w-12 bg-[oklch(0.14_0.06_295)] border border-pixel-purple px-1 py-0.5 text-foreground disabled:opacity-50"
            />
            min
          </label>
        </div>
      )}
    </div>
  );
}
