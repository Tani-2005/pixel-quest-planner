import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelButton } from "./PixelButton";
import type { RoomMode } from "@/lib/store";

const EMOJIS = ["📐", "💻", "📖", "🧪", "🎨", "🎵", "🌍", "🔬", "📝", "⚔️", "🎯", "🧠"];

const POMO_PRESETS = [15, 25, 50, 90];
const ANIME_PRESETS = [40, 50, 60];

export function CreateRoomDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: {
    name: string;
    subject: string;
    emoji: string;
    timerMinutes: number;
    breakMinutes: number;
    mode: RoomMode;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [emoji, setEmoji] = useState("📐");
  const [mode, setMode] = useState<RoomMode>("pomodoro");
  const [timer, setTimer] = useState(25);
  const [breakMin, setBreakMin] = useState(5);

  const reset = () => {
    setName("");
    setSubject("");
    setEmoji("📐");
    setMode("pomodoro");
    setTimer(25);
    setBreakMin(5);
  };

  const pickMode = (m: RoomMode) => {
    setMode(m);
    if (m === "animedoro") {
      setTimer(50);
      setBreakMin(10);
    } else {
      setTimer(25);
      setBreakMin(5);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, subject, emoji, timerMinutes: timer, breakMinutes: breakMin, mode });
    reset();
    onClose();
  };

  const presets = mode === "animedoro" ? ANIME_PRESETS : POMO_PRESETS;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            initial={{ y: 20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            className="bg-pixel-surface border-4 border-pixel-pink shadow-pixel-pink w-full max-w-lg p-6 my-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-pixel text-sm text-pixel-cyan">✦ Create Room</h2>
              <button
                type="button"
                onClick={onClose}
                className="font-pixel text-xs text-muted-foreground hover:text-pixel-pink"
              >
                ✕
              </button>
            </div>

            <label className="block font-pixel text-[8px] text-muted-foreground mb-2">
              ROOM NAME
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 40))}
              placeholder="Calc Crunch Hour"
              className="w-full font-sans text-sm bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-2 mb-4 text-foreground focus:border-pixel-cyan outline-none"
            />

            <label className="block font-pixel text-[8px] text-muted-foreground mb-2">
              SUBJECT
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value.slice(0, 30))}
              placeholder="MATH 210"
              className="w-full font-sans text-sm bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-2 mb-4 text-foreground focus:border-pixel-cyan outline-none"
            />

            <label className="block font-pixel text-[8px] text-muted-foreground mb-2">EMOJI</label>
            <div className="grid grid-cols-6 gap-2 mb-5">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={`text-2xl p-2 border-2 ${
                    emoji === em
                      ? "border-pixel-cyan bg-pixel-purple"
                      : "border-pixel-purple bg-[oklch(0.14_0.06_295)] hover:border-pixel-pink"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>

            <label className="block font-pixel text-[8px] text-muted-foreground mb-2">MODE</label>
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                type="button"
                onClick={() => pickMode("pomodoro")}
                className={`p-3 border-2 text-left ${
                  mode === "pomodoro"
                    ? "border-pixel-cyan bg-pixel-purple"
                    : "border-pixel-purple bg-[oklch(0.14_0.06_295)] hover:border-pixel-pink"
                }`}
              >
                <div className="font-pixel text-[10px] text-pixel-cyan">🍅 Pomodoro</div>
                <div className="font-pixel text-[7px] text-muted-foreground mt-1">25 / 5 classic</div>
              </button>
              <button
                type="button"
                onClick={() => pickMode("animedoro")}
                className={`p-3 border-2 text-left ${
                  mode === "animedoro"
                    ? "border-pixel-cyan bg-pixel-purple"
                    : "border-pixel-purple bg-[oklch(0.14_0.06_295)] hover:border-pixel-pink"
                }`}
              >
                <div className="font-pixel text-[10px] text-pixel-pink">🎬 Animedoro</div>
                <div className="font-pixel text-[7px] text-muted-foreground mt-1">50+ / 10 long</div>
              </button>
            </div>

            <label className="block font-pixel text-[8px] text-muted-foreground mb-2">
              FOCUS LENGTH
            </label>
            <div className="flex gap-2 flex-wrap mb-3">
              {presets.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTimer(t)}
                  className={`font-pixel text-[10px] px-3 py-2 border-2 ${
                    timer === t
                      ? "border-pixel-pink bg-pixel-pink text-white"
                      : "border-pixel-purple text-muted-foreground hover:border-pixel-cyan"
                  }`}
                >
                  {t}m
                </button>
              ))}
              <input
                type="number"
                min={5}
                max={120}
                value={timer}
                onChange={(e) => setTimer(Math.max(5, Math.min(120, parseInt(e.target.value) || 5)))}
                className="w-16 font-pixel text-[10px] bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-2 py-2 text-foreground"
              />
            </div>

            <label className="block font-pixel text-[8px] text-muted-foreground mb-2">
              BREAK LENGTH
            </label>
            <div className="flex gap-2 flex-wrap mb-6">
              {[5, 10, 15, 20].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBreakMin(t)}
                  className={`font-pixel text-[10px] px-3 py-2 border-2 ${
                    breakMin === t
                      ? "border-pixel-cyan bg-pixel-cyan text-[oklch(0.18_0.08_295)]"
                      : "border-pixel-purple text-muted-foreground hover:border-pixel-cyan"
                  }`}
                >
                  {t}m
                </button>
              ))}
              <input
                type="number"
                min={1}
                max={30}
                value={breakMin}
                onChange={(e) => setBreakMin(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                className="w-16 font-pixel text-[10px] bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-2 py-2 text-foreground"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <PixelButton type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </PixelButton>
              <PixelButton type="submit" variant="accent" size="sm">
                ▶ Create Room
              </PixelButton>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
