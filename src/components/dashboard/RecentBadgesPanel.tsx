import { Link } from "@tanstack/react-router";
import { BadgeUnlock, BADGES } from "@/lib/store";
import { PixelButton } from "@/components/PixelButton";
import { EmptyState } from "@/components/EmptyState";

export function RecentBadgesPanel({ badges }: { badges: BadgeUnlock[] }) {
  const recent = [...badges]
    .sort((a, b) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime())
    .slice(0, 4);

  return (
    <section className="bg-pixel-surface border-2 border-pixel-gold shadow-pixel-gold p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-pixel text-xs text-pixel-gold">Recent Badges</h3>
        <Link to="/badges">
          <PixelButton variant="ghost" size="sm">
            All →
          </PixelButton>
        </Link>
      </div>
      {recent.length === 0 ? (
        <EmptyState
          accent="gold"
          emoji="🔒"
          title="No badges yet"
          message="Complete your first quest to unlock the First Quest badge."
        />
      ) : (
        <div className="flex flex-wrap gap-4">
          {recent.map((b) => {
            const meta = BADGES.find((x) => x.key === b.key)!;
            return (
              <div
                key={b.key}
                className="bg-[oklch(0.14_0.06_295)] border-2 border-pixel-gold p-3 text-center min-w-[100px]"
              >
                <div className="text-3xl">{meta.emoji}</div>
                <div className="font-pixel text-[8px] text-pixel-gold mt-2">{meta.name}</div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
