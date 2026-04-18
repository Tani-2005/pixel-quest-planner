import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "High" | "Medium" | "Low";
export type TaskType = "Homework" | "Exam" | "Project" | "Club Task" | "Personal";
export type TaskStatus = "To Do" | "In Progress" | "Done";

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  subject: string;
  due_date: string; // ISO
  priority: Priority;
  status: TaskStatus;
  xp_reward: number;
  completed_at: string | null;
  created_at: string;
}

export interface BadgeUnlock {
  key: string;
  unlocked_at: string;
}

export interface User {
  username: string;
  avatar_emoji: string;
  total_xp: number;
  weekly_xp: number;
  level: number;
  streak_count: number;
  last_active_date: string | null;
}

export const XP_BY_PRIORITY: Record<Priority, number> = {
  High: 30,
  Medium: 20,
  Low: 10,
};

export const BADGES = [
  { key: "first_quest", emoji: "⚔️", name: "First Quest", desc: "Complete 1 task" },
  { key: "week_warrior", emoji: "🔥", name: "Week Warrior", desc: "7-day streak" },
  { key: "overachiever", emoji: "📚", name: "Overachiever", desc: "Complete 10 tasks" },
  { key: "century", emoji: "💯", name: "Century", desc: "Complete 100 tasks" },
  { key: "speed_run", emoji: "⚡", name: "Speed Run", desc: "Complete a task 1hr early" },
  { key: "boss_mode", emoji: "👾", name: "Boss Mode", desc: "Reach Level 10" },
  { key: "legend", emoji: "🏆", name: "Legend", desc: "Reach Level 20" },
  { key: "study_squad", emoji: "🧑‍💻", name: "Study Squad", desc: "Join a Study Room" },
  { key: "focus_master", emoji: "🧘", name: "Focus Master", desc: "60+ min in a room" },
] as const;

export function levelFromXp(xp: number) {
  return Math.floor(xp / 100) + 1;
}

export function petStage(level: number) {
  if (level >= 20) return { emoji: "🐉", name: "Dragon", stage: "Legendary", min: 20, next: 999 };
  if (level >= 10) return { emoji: "🐱", name: "Familiar", stage: "Bonded", min: 10, next: 20 };
  if (level >= 5) return { emoji: "🐣", name: "Hatchling", stage: "Awakened", min: 5, next: 10 };
  return { emoji: "🥚", name: "Egg", stage: "Dormant", min: 1, next: 5 };
}

interface State {
  authed: boolean;
  user: User;
  tasks: Task[];
  badges: BadgeUnlock[];
  // actions
  login: (username: string) => void;
  logout: () => void;
  addTask: (t: Omit<Task, "id" | "status" | "completed_at" | "created_at" | "xp_reward"> & { xp_reward?: number }) => void;
  completeTask: (id: string) => { gainedXp: number; leveledUp: boolean; newLevel: number; newBadges: string[] } | null;
  unlockBadgeIfNeeded: (key: string) => boolean;
  resetDemo: () => void;
}

const seedTasks = (): Task[] => {
  const now = new Date();
  const inDays = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();
  return [
    {
      id: crypto.randomUUID(),
      title: "Read Chapter 4 — Linear Algebra",
      type: "Homework",
      subject: "MATH 210",
      due_date: inDays(1),
      priority: "Medium",
      status: "To Do",
      xp_reward: 20,
      completed_at: null,
      created_at: now.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: "Midterm — Cognitive Psych",
      type: "Exam",
      subject: "PSY 301",
      due_date: inDays(3),
      priority: "High",
      status: "To Do",
      xp_reward: 30,
      completed_at: null,
      created_at: now.toISOString(),
    },
    {
      id: crypto.randomUUID(),
      title: "Plan club event poster",
      type: "Club Task",
      subject: "Design Club",
      due_date: inDays(-1),
      priority: "Low",
      status: "To Do",
      xp_reward: 10,
      completed_at: null,
      created_at: now.toISOString(),
    },
  ];
};

export const useGame = create<State>()(
  persist(
    (set, get) => ({
      authed: false,
      user: {
        username: "Player",
        avatar_emoji: "🧙",
        total_xp: 0,
        weekly_xp: 0,
        level: 1,
        streak_count: 0,
        last_active_date: null,
      },
      tasks: [],
      badges: [],

      login: (username) => {
        const existing = get().tasks;
        set({
          authed: true,
          user: { ...get().user, username: username || "Player" },
          tasks: existing.length ? existing : seedTasks(),
        });
      },
      logout: () => set({ authed: false }),

      addTask: (t) =>
        set((s) => ({
          tasks: [
            {
              id: crypto.randomUUID(),
              title: t.title,
              type: t.type,
              subject: t.subject,
              due_date: t.due_date,
              priority: t.priority,
              status: "To Do",
              xp_reward: t.xp_reward ?? XP_BY_PRIORITY[t.priority],
              completed_at: null,
              created_at: new Date().toISOString(),
            },
            ...s.tasks,
          ],
        })),

      unlockBadgeIfNeeded: (key) => {
        if (get().badges.find((b) => b.key === key)) return false;
        set((s) => ({ badges: [...s.badges, { key, unlocked_at: new Date().toISOString() }] }));
        return true;
      },

      completeTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task || task.status === "Done") return null;

        const now = new Date();
        const due = new Date(task.due_date);
        const earlyByMs = due.getTime() - now.getTime();
        const earlyBonus = earlyByMs > 0 ? 15 : 0;
        const gained = task.xp_reward + earlyBonus;

        const prevLevel = get().user.level;
        const newTotal = get().user.total_xp + gained;
        const newWeekly = get().user.weekly_xp + gained;
        const newLevel = levelFromXp(newTotal);

        // streak
        const today = now.toISOString().slice(0, 10);
        const last = get().user.last_active_date;
        let streak = get().user.streak_count;
        if (last !== today) {
          if (last) {
            const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
            streak = last === yesterday ? streak + 1 : 1;
          } else {
            streak = 1;
          }
        }

        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, status: "Done", completed_at: now.toISOString() } : t,
          ),
          user: {
            ...s.user,
            total_xp: newTotal,
            weekly_xp: newWeekly,
            level: newLevel,
            streak_count: streak,
            last_active_date: today,
          },
        }));

        // badge checks
        const completedCount = get().tasks.filter((t) => t.status === "Done").length;
        const newBadges: string[] = [];
        const tryUnlock = (k: string) => {
          if (get().unlockBadgeIfNeeded(k)) newBadges.push(k);
        };

        if (completedCount >= 1) tryUnlock("first_quest");
        if (completedCount >= 10) tryUnlock("overachiever");
        if (completedCount >= 100) tryUnlock("century");
        if (earlyByMs >= 60 * 60 * 1000) tryUnlock("speed_run");
        if (streak >= 7) tryUnlock("week_warrior");
        if (newLevel >= 10) tryUnlock("boss_mode");
        if (newLevel >= 20) tryUnlock("legend");

        return {
          gainedXp: gained,
          leveledUp: newLevel > prevLevel,
          newLevel,
          newBadges,
        };
      },

      resetDemo: () =>
        set({
          authed: false,
          user: {
            username: "Player",
            avatar_emoji: "🧙",
            total_xp: 0,
            weekly_xp: 0,
            level: 1,
            streak_count: 0,
            last_active_date: null,
          },
          tasks: [],
          badges: [],
        }),
    }),
    { name: "pixelquest-store" },
  ),
);
