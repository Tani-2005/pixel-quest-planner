import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoomMessage } from "@/lib/store";

const QUICK_REACTIONS = ["🎉", "🔥", "💯", "⚡", "💪", "🧠", "👏", "🦾"];

export function RoomChat({
  messages,
  onSend,
  onReaction,
}: {
  messages: RoomMessage[];
  onSend: (text: string) => void;
  onReaction: (emoji: string) => void;
}) {
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };

  return (
    <div className="bg-pixel-surface border-2 border-pixel-gold shadow-pixel-gold p-4 flex flex-col h-[420px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-pixel text-xs text-pixel-gold">💬 Cheers</h3>
        <span className="font-pixel text-[8px] text-muted-foreground">{messages.length} msg</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1"
        style={{ scrollbarWidth: "thin" }}
      >
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <p className="font-pixel text-[8px] text-muted-foreground text-center py-8">
              Be the first to cheer the squad on ✦
            </p>
          )}
          {messages.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-2 ${
                m.kind === "reaction" ? "" : "bg-[oklch(0.14_0.06_295)] border border-pixel-purple p-2"
              }`}
            >
              <span className="text-xl shrink-0">{m.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="font-pixel text-[8px] text-pixel-cyan flex items-center gap-2">
                  {m.author}
                  <span className="text-muted-foreground">
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div
                  className={`font-sans text-sm break-words mt-0.5 ${
                    m.kind === "reaction" ? "text-2xl" : "text-foreground/90"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Quick reactions */}
      <div className="flex flex-wrap gap-1 my-3">
        {QUICK_REACTIONS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => onReaction(e)}
            className="text-lg p-1 border border-pixel-purple bg-[oklch(0.14_0.06_295)] hover:border-pixel-pink hover:scale-110 transition-transform"
            title={`React ${e}`}
          >
            {e}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 80))}
          placeholder="Type a cheer…"
          className="flex-1 font-sans text-sm bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-2 py-2 focus:border-pixel-cyan outline-none text-foreground"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="font-pixel text-[9px] px-3 bg-pixel-pink text-white border-2 border-pixel-purple disabled:opacity-40 hover:bg-pixel-cyan hover:text-[oklch(0.18_0.08_295)]"
        >
          SEND
        </button>
      </form>
    </div>
  );
}
