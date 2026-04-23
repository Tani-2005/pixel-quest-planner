import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth-guard";
import { HUD } from "@/components/HUD";
import { useGame } from "@/lib/store";
import { PixelButton } from "@/components/PixelButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/friends")({
  head: () => ({
    meta: [
      { title: "Friends — PixelQuest" },
      { name: "description", content: "Your study squad: see who's online and invite friends to a room." },
    ],
  }),
  beforeLoad: requireAuth,
  component: FriendsPage,
});

function FriendsPage() {
  const { friends, addFriend, rooms } = useGame();
  const [name, setName] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [inviteRoom, setInviteRoom] = useState<string>(rooms[0]?.id ?? "");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const f = addFriend(name);
    if (f) {
      setName("");
      setToast(`${f.emoji} ${f.name} joined your squad!`);
      setTimeout(() => setToast(null), 2200);
    } else {
      setToast("Already in your squad");
      setTimeout(() => setToast(null), 1800);
    }
  };

  const inviteLink = (roomId: string) =>
    typeof window !== "undefined" ? `${window.location.origin}/study/room/${roomId}` : `/study/room/${roomId}`;

  const copyInvite = async (roomId: string, friendName: string) => {
    const link = inviteLink(roomId);
    try {
      await navigator.clipboard.writeText(link);
      setToast(`Invite for ${friendName} copied ✦`);
    } catch {
      setToast(link);
    }
    setTimeout(() => setToast(null), 2000);
  };

  const online = friends.filter((f) => f.online);
  const offline = friends.filter((f) => !f.online);

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-8">
      <HUD />
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-pixel text-base md:text-lg text-pixel-cyan">👥 Friends</h1>
          <p className="font-pixel text-[8px] text-muted-foreground mt-2">
            Your study squad · {online.length} online · {friends.length} total
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add friend + invite link */}
          <div className="space-y-4">
            <form
              onSubmit={handleAdd}
              className="bg-pixel-surface border-2 border-pixel-pink shadow-pixel-pink p-5"
            >
              <h3 className="font-pixel text-xs text-pixel-pink mb-3">+ Add friend</h3>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Friend's name"
                className="w-full font-sans text-sm bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-2 mb-3 focus:border-pixel-cyan outline-none"
              />
              <PixelButton type="submit" variant="accent" size="sm" className="w-full">
                Add
              </PixelButton>
            </form>

            <div className="bg-pixel-surface border-2 border-pixel-cyan shadow-pixel-cyan p-5">
              <h3 className="font-pixel text-xs text-pixel-cyan mb-3">🔗 Invite link</h3>
              <label className="block font-pixel text-[8px] text-muted-foreground mb-2">
                ROOM
              </label>
              <select
                value={inviteRoom}
                onChange={(e) => setInviteRoom(e.target.value)}
                className="w-full font-sans text-sm bg-[oklch(0.14_0.06_295)] border-2 border-pixel-purple px-3 py-2 mb-3 outline-none"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.emoji} {r.name}
                  </option>
                ))}
              </select>
              <code className="block font-mono text-[10px] bg-[oklch(0.14_0.06_295)] border border-pixel-purple p-2 break-all text-pixel-cyan">
                {inviteRoom ? inviteLink(inviteRoom) : "—"}
              </code>
              <PixelButton
                type="button"
                variant="secondary"
                size="sm"
                className="w-full mt-3"
                onClick={() => inviteRoom && copyInvite(inviteRoom, "your friend")}
                disabled={!inviteRoom}
              >
                ⎘ Copy link
              </PixelButton>
            </div>
          </div>

          {/* Friend list */}
          <div className="lg:col-span-2 space-y-6">
            <Section title="● Online" tone="green" friends={online} onInvite={copyInvite} rooms={rooms} />
            <Section title="○ Offline" tone="muted" friends={offline} onInvite={copyInvite} rooms={rooms} />
          </div>
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[200] font-pixel text-[10px] bg-pixel-gold text-[oklch(0.18_0.08_295)] px-4 py-2 border-2 border-pixel-purple shadow-pixel max-w-[90vw] text-center"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  title,
  tone,
  friends,
  onInvite,
  rooms,
}: {
  title: string;
  tone: "green" | "muted";
  friends: { id: string; name: string; emoji: string; weekly_minutes: number; weekly_xp: number }[];
  onInvite: (roomId: string, name: string) => void;
  rooms: { id: string; name: string; emoji: string }[];
}) {
  const color = tone === "green" ? "text-pixel-green" : "text-muted-foreground";
  return (
    <div>
      <h3 className={`font-pixel text-xs ${color} mb-3`}>
        {title} <span className="text-muted-foreground">· {friends.length}</span>
      </h3>
      {friends.length === 0 ? (
        <p className="font-pixel text-[8px] text-muted-foreground bg-pixel-surface border-2 border-dashed border-pixel-purple p-4 text-center">
          Nobody here yet
        </p>
      ) : (
        <ul className="space-y-2">
          {friends.map((f) => (
            <li
              key={f.id}
              className="bg-pixel-surface border-2 border-pixel-purple p-3 flex items-center gap-3"
            >
              <div className="text-2xl">{f.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-sm font-medium truncate">{f.name}</div>
                <div className="font-pixel text-[8px] text-muted-foreground mt-1">
                  {f.weekly_minutes}m · {f.weekly_xp} XP this week
                </div>
              </div>
              <select
                onChange={(e) => e.target.value && onInvite(e.target.value, f.name)}
                defaultValue=""
                className="font-pixel text-[8px] bg-[oklch(0.14_0.06_295)] border-2 border-pixel-cyan text-pixel-cyan px-2 py-1 hover:bg-pixel-cyan hover:text-[oklch(0.18_0.08_295)]"
              >
                <option value="">Invite to…</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.emoji} {r.name}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
