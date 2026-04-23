import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "@/lib/auth-guard";
import { HUD } from "@/components/HUD";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { ToastStack } from "@/components/PixelToast";
import { CompletionBurst } from "@/components/CompletionBurst";
import { PixelButton } from "@/components/PixelButton";
import { RoomChat } from "@/components/RoomChat";
import { useGame } from "@/lib/store";
import { useGameFeedback } from "@/hooks/useGameFeedback";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/study/room/$roomId")({
  head: () => ({
    meta: [
      { title: "Study Room — PixelQuest" },
      { name: "description", content: "Focus together with your party in a shared study room." },
    ],
  }),
  beforeLoad: requireAuth,
  notFoundComponent: RoomNotFound,
  component: RoomPage,
});

function RoomNotFound() {
  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20">
      <HUD />
      <main className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">🚪</div>
        <h1 className="font-pixel text-base text-pixel-pink">Room not found</h1>
        <Link to="/study">
          <PixelButton variant="ghost" className="mt-6">
            ← Back to Lobby
          </PixelButton>
        </Link>
      </main>
    </div>
  );
}

function RoomPage() {
  const { roomId } = Route.useParams();
  const { rooms, user, joinRoom, logStudySession, messages, postCheer } = useGame();
  const room = rooms.find((r) => r.id === roomId);
  const fb = useGameFeedback();
  const nav = useNavigate();
  const [copied, setCopied] = useState(false);

  // join on mount
  useEffect(() => {
    if (!room) return;
    const r = joinRoom(room.id);
    if (r.newBadges.length) {
      fb.handleResult({ gainedXp: 0, leveledUp: false, newLevel: 0, newBadges: r.newBadges });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roomMessages = useMemo(
    () => messages.filter((m) => m.room_id === roomId),
    [messages, roomId],
  );

  if (!room) {
    return <RoomNotFound />;
  }

  const handleSession = (minutes: number) => {
    const r = logStudySession(minutes, room.id);
    fb.handleResult(
      { gainedXp: r.xp, leveledUp: false, newLevel: 0, newBadges: r.newBadges },
      { x: window.innerWidth / 2, y: window.innerHeight / 2 - 100 },
    );
  };

  const sendCheer = (text: string) => postCheer(room.id, text, "cheer");
  const sendReaction = (emoji: string) => postCheer(room.id, emoji, "reaction");

  const inviteLink =
    typeof window !== "undefined" ? `${window.location.origin}/study/room/${room.id}` : `/study/room/${room.id}`;

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      fb.pushToast({ id: crypto.randomUUID(), message: "🔗 Invite link copied!", variant: "xp" });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      fb.pushToast({ id: crypto.randomUUID(), message: inviteLink, variant: "xp" });
    }
  };

  // mix the player into the member list
  const allMembers = [
    { name: user.username, emoji: user.avatar_emoji || "🧙", status: "focused" as const, you: true },
    ...room.members.map((m) => ({ ...m, you: false })),
  ];

  return (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20 md:pb-8 relative">
      <HUD />
      <AmbientBackdrop tone="gold" />
      <ToastStack items={fb.toasts} />
      <CompletionBurst events={fb.bursts} />

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 relative">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{room.emoji}</div>
            <div>
              <h1 className="font-pixel text-base text-pixel-cyan">{room.name}</h1>
              <p className="font-pixel text-[8px] text-muted-foreground mt-1">
                {room.subject} · {allMembers.length} members
                {room.created_by_you && (
                  <span className="ml-2 text-pixel-gold">· hosted by you</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <PixelButton variant="secondary" size="sm" onClick={copyInvite}>
              {copied ? "✓ Copied" : "🔗 Invite"}
            </PixelButton>
            <Link to="/study">
              <PixelButton variant="ghost" size="sm" onClick={() => nav({ to: "/study" })}>
                ← Leave
              </PixelButton>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* shared timer */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-pixel-surface border-2 border-pixel-pink shadow-pixel-pink p-8 relative">
              <div className="font-pixel text-[8px] text-muted-foreground mb-4 text-center">
                SHARED FOCUS · everyone&apos;s timer
              </div>
              <PomodoroTimer
                workMinutes={room.active_timer_minutes}
                onSessionComplete={handleSession}
                accent="pink"
              />
            </div>

            {/* members */}
            <div className="bg-pixel-surface border-2 border-pixel-cyan shadow-pixel-cyan p-5">
              <h3 className="font-pixel text-xs text-pixel-cyan mb-4">Party</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {allMembers.map((m) => (
                  <li
                    key={m.name}
                    className={`flex items-center justify-between gap-2 bg-[oklch(0.14_0.06_295)] border ${
                      m.you ? "border-pixel-pink" : "border-pixel-purple"
                    } p-2`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <motion.span
                        className="text-2xl"
                        animate={m.status === "focused" ? { y: [0, -3, 0] } : {}}
                        transition={{ duration: 2.4, repeat: Infinity }}
                      >
                        {m.emoji}
                      </motion.span>
                      <div className="min-w-0">
                        <div className="font-sans text-xs font-medium truncate">
                          {m.name} {m.you && <span className="text-pixel-pink">(you)</span>}
                        </div>
                        <div
                          className={`font-pixel text-[7px] ${
                            m.status === "focused"
                              ? "text-pixel-green"
                              : m.status === "break"
                                ? "text-pixel-gold"
                                : "text-muted-foreground"
                          }`}
                        >
                          ● {m.status}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* chat */}
          <div>
            <RoomChat
              messages={roomMessages}
              onSend={sendCheer}
              onReaction={sendReaction}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
