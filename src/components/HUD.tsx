import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useGame, petStage } from "@/lib/store";
import { XPBar } from "./XPBar";
import { PixelButton } from "./PixelButton";

export function HUD() {
  const { user, logout } = useGame();
  const navigate = useNavigate();
  const loc = useLocation();
  const pet = petStage(user.level);

  const tabs = [
    { to: "/dashboard", label: "Home" },
    { to: "/tasks", label: "Tasks" },
    { to: "/study", label: "Study" },
    { to: "/leaderboard", label: "Ranks" },
    { to: "/friends", label: "Friends" },
    { to: "/badges", label: "Badges" },
    { to: "/settings", label: "Settings" },
  ] as const;

  return (
    <div className="sticky top-0 z-50 bg-pixel-surface border-b-2 border-pixel-purple">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
        <Link to="/dashboard" className="flex items-center gap-3">
          <span className="text-3xl animate-float-bob">{pet.emoji}</span>
          <div>
            <div className="font-pixel text-[10px] text-pixel-cyan">PixelQuest</div>
            <div className="font-pixel text-[8px] text-muted-foreground">{user.username}</div>
          </div>
        </Link>

        <div className="flex-1 min-w-[180px] max-w-md">
          <div className="flex items-center gap-2">
            <div className="font-pixel text-[10px] bg-pixel-pink text-white px-2 py-1 border-2 border-pixel-purple">
              LVL {user.level}
            </div>
            <div className="flex-1">
              <XPBar totalXp={user.total_xp} compact />
            </div>
          </div>
        </div>

        <div className="font-pixel text-[10px] text-pixel-gold flex items-center gap-1">
          🔥 <span>{user.streak_count}</span>
        </div>

        <nav className="hidden md:flex gap-2">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={`font-pixel text-[10px] px-3 py-2 border-2 ${
                loc.pathname === t.to
                  ? "bg-pixel-purple text-white border-pixel-pink"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-pixel-purple"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <PixelButton
          variant="ghost"
          size="sm"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
        >
          Exit
        </PixelButton>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-pixel-surface border-t-2 border-pixel-purple flex">
        {tabs.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className={`flex-1 text-center py-3 font-pixel text-[8px] ${
              loc.pathname === t.to ? "bg-pixel-purple text-white" : "text-muted-foreground"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
