import { createFileRoute } from "@tanstack/react-router";
import { HUD } from "@/components/HUD";

export const Route = createFileRoute("/study")({
  head: () => ({ meta: [{ title: "Study Room — PixelQuest" }] }),
  component: () => (
    <div className="min-h-screen bg-background pixel-grid-bg pb-20">
      <HUD />
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-6">🏕️</div>
        <h1 className="font-pixel text-base md:text-lg text-pixel-cyan">Study Room</h1>
        <p className="font-pixel text-[10px] text-muted-foreground mt-4">
          Coming soon — real-time focus rooms with your party.
        </p>
        <div className="mt-10 inline-block bg-pixel-surface border-2 border-pixel-purple shadow-pixel p-6">
          <p className="font-sans text-sm text-foreground/80">
            Phase 2 unlocks live presence, shared focus status, and session XP.
          </p>
        </div>
      </main>
    </div>
  ),
});
