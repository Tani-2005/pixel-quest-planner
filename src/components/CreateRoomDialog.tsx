import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelButton } from "./PixelButton";

const EMOJIS = ["📐", "💻", "📖", "🧪", "🎨", "🎵", "🌍", "🔬", "📝", "⚔️", "🎯", "🧠"];
const TIMERS = [15, 25, 50, 90];

export function CreateRoomDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: { name: string; subject: string; emoji: string; timerMinutes: number }) => void;
}) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [emoji, setEmoji] = useState("📐");
  const [timer, setTimer] = useState(25);

  const reset = () => {
    setName("");
    setSubject("");
    setEmoji("📐");
    setTimer(25);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, subject, emoji, timerMinutes: timer });
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            initial={{ y: 20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            className="bg-pixel-surface border-4 border-pixel-pink shadow-pixel-pink w-full max-w-lg p-6"
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
              SUBJECT (e.g. MATH 210)
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

            <label className="block font-pixel text-[8px] text-muted-foreground mb-2">
              TIMER LENGTH
            </label>
            <div className="flex gap-2 flex-wrap mb-6">
              {TIMERS.map((t) => (
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
