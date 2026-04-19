import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Room } from "@/lib/store";

export function RoomCard({ room }: { room: Room }) {
  const focused = room.members.filter((m) => m.status === "focused").length;
  return (
    <Link
      to="/study/room/$roomId"
      params={{ roomId: room.id }}
      className="block bg-pixel-surface border-2 border-pixel-purple shadow-pixel p-5 hover:border-pixel-pink hover:shadow-pixel-pink transition-colors pixel-press"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-3xl mb-1">{room.emoji}</div>
          <div className="font-pixel text-xs text-pixel-cyan">{room.name}</div>
          <div className="font-pixel text-[8px] text-muted-foreground mt-1">{room.subject}</div>
        </div>
        <div className="text-right">
          <div className="font-pixel text-[8px] text-pixel-gold">{room.active_timer_minutes}m</div>
          <div className="font-pixel text-[8px] text-muted-foreground mt-1">cycles</div>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-4">
        {room.members.slice(0, 5).map((m, i) => (
          <motion.span
            key={i}
            className="text-xl"
            animate={m.status === "focused" ? { y: [0, -2, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            title={`${m.name} · ${m.status}`}
          >
            {m.emoji}
          </motion.span>
        ))}
        {room.members.length > 5 && (
          <span className="font-pixel text-[8px] text-muted-foreground ml-1">
            +{room.members.length - 5}
          </span>
        )}
      </div>
      <div className="font-pixel text-[8px] text-pixel-green mt-2">● {focused} focusing now</div>
    </Link>
  );
}
