import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Priority = "High" | "Medium" | "Low";
export type TaskType = "Homework" | "Exam" | "Project" | "Club Task" | "Personal";
export type TaskStatus = "To Do" | "In Progress" | "Done";
export type Recurrence = "none" | "daily" | "weekly";
export type Difficulty = "Easy" | "Medium" | "Epic";
export type AccentTheme = "pink" | "cyan" | "gold" | "green";
export type PetHat = "none" | "crown" | "wizard" | "cap" | "halo";

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
  recurrence: Recurrence;
  order: number;
  difficulty: Difficulty;
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
  daily_xp_goal: number;
  pet_name: string;
  pet_hat: PetHat;
  accent: AccentTheme;
  sound_enabled: boolean;
}

export interface StudySession {
  id: string;
  started_at: string;
  ended_at: string;
  minutes: number;
  xp_gained: number;
  room_id: string | null;
}

export interface RoomMember {
  name: string;
  emoji: string;
  status: "focused" | "break" | "idle";
}

export type RoomMode = "pomodoro" | "animedoro";

export interface Room {
  id: string;
  code: string; // 6-char room code for join-by-code
  name: string;
  subject: string;
  emoji: string;
  members: RoomMember[];
  active_timer_started_at: string | null;
  active_timer_minutes: number;
  break_minutes: number;
  mode: RoomMode;
  created_by_you?: boolean;
}

export interface RoomMessage {
  id: string;
  room_id: string;
  author: string;
  emoji: string;
  text: string; // emoji-only or short cheer
  kind: "cheer" | "reaction" | "system";
  created_at: string;
}

export interface Friend {
  id: string;
  name: string;
  emoji: string;
  weekly_minutes: number;
  weekly_xp: number;
  online: boolean;
}

export const XP_BY_PRIORITY: Record<Priority, number> = {
  High: 30,
  Medium: 20,
  Low: 10,
};

export const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  Easy: 0.75,
  Medium: 1,
  Epic: 1.6,
};

export const DIFFICULTY_META: Record<Difficulty, { emoji: string; color: string }> = {
  Easy: { emoji: "🟢", color: "text-pixel-green" },
  Medium: { emoji: "🟡", color: "text-pixel-gold" },
  Epic: { emoji: "🔥", color: "text-pixel-pink" },
};

export function xpForTask(priority: Priority, difficulty: Difficulty) {
  return Math.round(XP_BY_PRIORITY[priority] * DIFFICULTY_MULTIPLIER[difficulty]);
}

export const BADGES = [
  { key: "first_quest", emoji: "⚔️", name: "First Quest", desc: "Complete 1 task" },
  { key: "week_warrior", emoji: "🔥", name: "Week Warrior", desc: "7-day streak" },
  { key: "overachiever", emoji: "📚", name: "Overachiever", desc: "Complete 10 tasks" },
  { key: "century", emoji: "💯", name: "Century", desc: "Complete 100 tasks" },
  { key: "speed_run", emoji: "⚡", name: "Speed Run", desc: "Complete a task 1hr early" },
  { key: "boss_mode", emoji: "👾", name: "Boss Mode", desc: "Reach Level 10" },
  { key: "legend", emoji: "🏆", name: "Legend", desc: "Reach Level 20" },
  { key: "study_squad", emoji: "🧑‍💻", name: "Study Squad", desc: "Join a Study Room" },
  { key: "focus_master", emoji: "🧘", name: "Focus Master", desc: "60+ min in focus" },
  { key: "room_host", emoji: "🛠", name: "Room Host", desc: "Create your first room" },
] as const;

export function levelFromXp(xp: number) {
  return Math.floor(xp / 100) + 1;
}

export function petStage(level: number) {
  if (level >= 20) return { emoji: "🐉", name: "Dragon", stage: "Legendary", min: 20, next: 999, nextEmoji: "✨" };
  if (level >= 10) return { emoji: "🐱", name: "Familiar", stage: "Bonded", min: 10, next: 20, nextEmoji: "🐉" };
  if (level >= 5) return { emoji: "🐣", name: "Hatchling", stage: "Awakened", min: 5, next: 10, nextEmoji: "🐱" };
  return { emoji: "🥚", name: "Egg", stage: "Dormant", min: 1, next: 5, nextEmoji: "🐣" };
}

// Deterministic subject color from a fixed palette token
const SUBJECT_TOKENS = [
  "pixel-cyan",
  "pixel-pink",
  "pixel-gold",
  "pixel-green",
  "pixel-purple",
  "pixel-red",
] as const;

export function subjectColor(subject: string): (typeof SUBJECT_TOKENS)[number] {
  if (!subject) return "pixel-purple";
  let h = 0;
  for (let i = 0; i < subject.length; i++) h = (h * 31 + subject.charCodeAt(i)) >>> 0;
  return SUBJECT_TOKENS[h % SUBJECT_TOKENS.length];
}

const todayKey = (d = new Date()) => d.toISOString().slice(0, 10);

interface State {
  authed: boolean;
  user: User;
  tasks: Task[];
  badges: BadgeUnlock[];
  xp_log: Record<string, number>; // date (YYYY-MM-DD) -> xp earned
  sessions: StudySession[];
  rooms: Room[];
  messages: RoomMessage[];
  friends: Friend[];
  // actions
  login: (username: string) => void;
  logout: () => void;
  addTask: (
    t: Omit<
      Task,
      "id" | "status" | "completed_at" | "created_at" | "xp_reward" | "order" | "recurrence" | "difficulty"
    > & {
      xp_reward?: number;
      recurrence?: Recurrence;
      difficulty?: Difficulty;
    },
  ) => void;
  completeTask: (
    id: string,
  ) => { gainedXp: number; leveledUp: boolean; newLevel: number; newBadges: string[] } | null;
  reorderTasks: (orderedIds: string[]) => void;
  unlockBadgeIfNeeded: (key: string) => boolean;
  setDailyGoal: (xp: number) => void;
  setPetName: (name: string) => void;
  setPetHat: (hat: PetHat) => void;
  setAccent: (accent: AccentTheme) => void;
  setSoundEnabled: (enabled: boolean) => void;
  logStudySession: (minutes: number, roomId: string | null) => { xp: number; newBadges: string[] };
  joinRoom: (roomId: string) => { newBadges: string[] };
  createRoom: (input: {
    name: string;
    subject: string;
    emoji: string;
    timerMinutes: number;
  }) => { room: Room; newBadges: string[] };
  postCheer: (roomId: string, text: string, kind?: RoomMessage["kind"]) => void;
  addFriend: (name: string) => Friend | null;
  resetDemo: () => void;
}

const seedRooms = (): Room[] => [
  {
    id: "math-cram",
    name: "Math Cram",
    subject: "MATH 210",
    emoji: "📐",
    members: [
      { name: "Aria", emoji: "🦊", status: "focused" },
      { name: "Kenji", emoji: "🐼", status: "focused" },
      { name: "Lin", emoji: "🦉", status: "break" },
    ],
    active_timer_started_at: null,
    active_timer_minutes: 25,
  },
  {
    id: "late-coders",
    name: "Late Night Coders",
    subject: "CS 240",
    emoji: "💻",
    members: [
      { name: "Sam", emoji: "🐸", status: "focused" },
      { name: "Ria", emoji: "🐰", status: "focused" },
    ],
    active_timer_started_at: null,
    active_timer_minutes: 50,
  },
  {
    id: "lit-circle",
    name: "Lit Circle",
    subject: "ENG 110",
    emoji: "📖",
    members: [
      { name: "Mira", emoji: "🐧", status: "idle" },
      { name: "Theo", emoji: "🦝", status: "focused" },
      { name: "Yuki", emoji: "🐯", status: "focused" },
      { name: "Jay", emoji: "🐨", status: "break" },
    ],
    active_timer_started_at: null,
    active_timer_minutes: 25,
  },
];

const seedFriends = (): Friend[] => [
  { id: "f1", name: "Aria", emoji: "🦊", weekly_minutes: 320, weekly_xp: 480, online: true },
  { id: "f2", name: "Kenji", emoji: "🐼", weekly_minutes: 280, weekly_xp: 410, online: true },
  { id: "f3", name: "Lin", emoji: "🦉", weekly_minutes: 240, weekly_xp: 360, online: false },
  { id: "f4", name: "Sam", emoji: "🐸", weekly_minutes: 200, weekly_xp: 290, online: true },
  { id: "f5", name: "Ria", emoji: "🐰", weekly_minutes: 165, weekly_xp: 240, online: false },
  { id: "f6", name: "Theo", emoji: "🦝", weekly_minutes: 140, weekly_xp: 200, online: true },
  { id: "f7", name: "Mira", emoji: "🐧", weekly_minutes: 95, weekly_xp: 140, online: false },
];

const seedMessages = (): RoomMessage[] => {
  const now = Date.now();
  const ago = (m: number) => new Date(now - m * 60000).toISOString();
  return [
    { id: crypto.randomUUID(), room_id: "math-cram", author: "Aria", emoji: "🦊", text: "🎉 GG focus team!", kind: "cheer", created_at: ago(28) },
    { id: crypto.randomUUID(), room_id: "math-cram", author: "Kenji", emoji: "🐼", text: "🔥", kind: "reaction", created_at: ago(22) },
    { id: crypto.randomUUID(), room_id: "math-cram", author: "Lin", emoji: "🦉", text: "let's gooo 💪", kind: "cheer", created_at: ago(15) },
    { id: crypto.randomUUID(), room_id: "late-coders", author: "Sam", emoji: "🐸", text: "⚡", kind: "reaction", created_at: ago(40) },
    { id: crypto.randomUUID(), room_id: "late-coders", author: "Ria", emoji: "🐰", text: "💯 keep pushing", kind: "cheer", created_at: ago(12) },
  ];
};

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
      recurrence: "none",
      order: 0,
      difficulty: "Medium",
    },
    {
      id: crypto.randomUUID(),
      title: "Midterm — Cognitive Psych",
      type: "Exam",
      subject: "PSY 301",
      due_date: inDays(3),
      priority: "High",
      status: "To Do",
      xp_reward: 48,
      completed_at: null,
      created_at: now.toISOString(),
      recurrence: "none",
      order: 1,
      difficulty: "Epic",
    },
    {
      id: crypto.randomUUID(),
      title: "Plan club event poster",
      type: "Club Task",
      subject: "Design Club",
      due_date: inDays(-1),
      priority: "Low",
      status: "To Do",
      xp_reward: 8,
      completed_at: null,
      created_at: now.toISOString(),
      recurrence: "none",
      order: 2,
      difficulty: "Easy",
    },
  ];
};

const initialUser: User = {
  username: "Player",
  avatar_emoji: "🧙",
  total_xp: 0,
  weekly_xp: 0,
  level: 1,
  streak_count: 0,
  last_active_date: null,
  daily_xp_goal: 50,
  pet_name: "",
  pet_hat: "none",
  accent: "pink",
  sound_enabled: true,
};

export const useGame = create<State>()(
  persist(
    (set, get) => ({
      authed: false,
      user: initialUser,
      tasks: [],
      badges: [],
      xp_log: {},
      sessions: [],
      rooms: seedRooms(),
      messages: seedMessages(),
      friends: seedFriends(),

      login: (username) => {
        const existing = get().tasks;
        set({
          authed: true,
          user: { ...get().user, username: username || "Player" },
          tasks: existing.length ? existing : seedTasks(),
          rooms: get().rooms.length ? get().rooms : seedRooms(),
          friends: get().friends.length ? get().friends : seedFriends(),
          messages: get().messages.length ? get().messages : seedMessages(),
        });
      },
      logout: () => set({ authed: false }),

      addTask: (t) =>
        set((s) => {
          const maxOrder = s.tasks.reduce((m, x) => Math.max(m, x.order ?? 0), -1);
          const difficulty = t.difficulty ?? "Medium";
          return {
            tasks: [
              {
                id: crypto.randomUUID(),
                title: t.title,
                type: t.type,
                subject: t.subject,
                due_date: t.due_date,
                priority: t.priority,
                status: "To Do" as TaskStatus,
                xp_reward: t.xp_reward ?? xpForTask(t.priority, difficulty),
                completed_at: null,
                created_at: new Date().toISOString(),
                recurrence: t.recurrence ?? "none",
                order: maxOrder + 1,
                difficulty,
              },
              ...s.tasks,
            ],
          };
        }),

      reorderTasks: (orderedIds) =>
        set((s) => {
          const indexMap = new Map(orderedIds.map((id, i) => [id, i]));
          return {
            tasks: s.tasks.map((t) =>
              indexMap.has(t.id) ? { ...t, order: indexMap.get(t.id)! } : t,
            ),
          };
        }),

      unlockBadgeIfNeeded: (key) => {
        if (get().badges.find((b) => b.key === key)) return false;
        set((s) => ({ badges: [...s.badges, { key, unlocked_at: new Date().toISOString() }] }));
        return true;
      },

      setDailyGoal: (xp) =>
        set((s) => ({ user: { ...s.user, daily_xp_goal: Math.max(10, Math.min(500, xp)) } })),

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

        const today = todayKey(now);
        const last = get().user.last_active_date;
        let streak = get().user.streak_count;
        if (last !== today) {
          if (last) {
            const yesterday = todayKey(new Date(now.getTime() - 86400000));
            streak = last === yesterday ? streak + 1 : 1;
          } else {
            streak = 1;
          }
        }

        // recurrence: spawn next instance
        let extraTasks: Task[] = [];
        if (task.recurrence !== "none") {
          const days = task.recurrence === "daily" ? 1 : 7;
          const nextDue = new Date(due.getTime() + days * 86400000).toISOString();
          const maxOrder = get().tasks.reduce((m, x) => Math.max(m, x.order ?? 0), -1);
          extraTasks = [
            {
              ...task,
              id: crypto.randomUUID(),
              status: "To Do",
              completed_at: null,
              created_at: now.toISOString(),
              due_date: nextDue,
              order: maxOrder + 1,
            },
          ];
        }

        set((s) => ({
          tasks: [
            ...s.tasks.map((t) =>
              t.id === id ? { ...t, status: "Done" as TaskStatus, completed_at: now.toISOString() } : t,
            ),
            ...extraTasks,
          ],
          user: {
            ...s.user,
            total_xp: newTotal,
            weekly_xp: newWeekly,
            level: newLevel,
            streak_count: streak,
            last_active_date: today,
          },
          xp_log: { ...s.xp_log, [today]: (s.xp_log[today] ?? 0) + gained },
        }));

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

      logStudySession: (minutes, roomId) => {
        const xp = Math.max(5, Math.floor(minutes) * 1); // 1 XP per minute, min 5
        const now = new Date();
        const startedAt = new Date(now.getTime() - minutes * 60000).toISOString();
        const today = todayKey(now);

        set((s) => ({
          sessions: [
            { id: crypto.randomUUID(), started_at: startedAt, ended_at: now.toISOString(), minutes, xp_gained: xp, room_id: roomId },
            ...s.sessions,
          ],
          user: {
            ...s.user,
            total_xp: s.user.total_xp + xp,
            weekly_xp: s.user.weekly_xp + xp,
            level: levelFromXp(s.user.total_xp + xp),
            last_active_date: today,
          },
          xp_log: { ...s.xp_log, [today]: (s.xp_log[today] ?? 0) + xp },
        }));

        const totalFocusMin = get().sessions.reduce((sum, x) => sum + x.minutes, 0);
        const newBadges: string[] = [];
        const tryUnlock = (k: string) => {
          if (get().unlockBadgeIfNeeded(k)) newBadges.push(k);
        };
        if (totalFocusMin >= 60) tryUnlock("focus_master");

        return { xp, newBadges };
      },

      joinRoom: (_roomId) => {
        const newBadges: string[] = [];
        if (get().unlockBadgeIfNeeded("study_squad")) newBadges.push("study_squad");
        return { newBadges };
      },

      createRoom: ({ name, subject, emoji, timerMinutes }) => {
        const id = `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        const room: Room = {
          id,
          name: name.trim().slice(0, 40) || "My Study Room",
          subject: subject.trim().slice(0, 30) || "General",
          emoji: emoji || "🎯",
          members: [],
          active_timer_started_at: null,
          active_timer_minutes: Math.max(5, Math.min(120, Math.round(timerMinutes))),
          created_by_you: true,
        };
        set((s) => ({ rooms: [room, ...s.rooms] }));
        const newBadges: string[] = [];
        if (get().unlockBadgeIfNeeded("room_host")) newBadges.push("room_host");
        return { room, newBadges };
      },

      postCheer: (roomId, text, kind = "cheer") => {
        const u = get().user;
        const msg: RoomMessage = {
          id: crypto.randomUUID(),
          room_id: roomId,
          author: u.username,
          emoji: u.avatar_emoji,
          text: text.slice(0, 80),
          kind,
          created_at: new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, msg].slice(-200) }));
      },

      addFriend: (name) => {
        const trimmed = name.trim().slice(0, 24);
        if (!trimmed) return null;
        if (get().friends.some((f) => f.name.toLowerCase() === trimmed.toLowerCase())) return null;
        const emojis = ["🐺", "🐢", "🦄", "🐙", "🦋", "🐝", "🦔", "🦦"];
        const friend: Friend = {
          id: `f-${Date.now().toString(36)}`,
          name: trimmed,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          weekly_minutes: Math.floor(Math.random() * 80),
          weekly_xp: Math.floor(Math.random() * 120),
          online: Math.random() > 0.4,
        };
        set((s) => ({ friends: [friend, ...s.friends] }));
        return friend;
      },

      setPetName: (name) => set((s) => ({ user: { ...s.user, pet_name: name.slice(0, 20) } })),
      setPetHat: (hat) => set((s) => ({ user: { ...s.user, pet_hat: hat } })),
      setAccent: (accent) => set((s) => ({ user: { ...s.user, accent } })),
      setSoundEnabled: (enabled) => set((s) => ({ user: { ...s.user, sound_enabled: enabled } })),

      resetDemo: () =>
        set({
          authed: false,
          user: initialUser,
          tasks: [],
          badges: [],
          xp_log: {},
          sessions: [],
          rooms: seedRooms(),
          messages: seedMessages(),
          friends: seedFriends(),
        }),
    }),
    {
      name: "pixelquest-store",
      version: 4,
      migrate: (persisted: unknown, version) => {
        const p = (persisted ?? {}) as Partial<State>;
        if (version < 4) {
          return {
            ...p,
            user: { ...initialUser, ...(p.user ?? {}) },
            tasks: (p.tasks ?? []).map((t, i) => ({
              ...t,
              recurrence: (t as Task).recurrence ?? "none",
              order: (t as Task).order ?? i,
              difficulty: (t as Task).difficulty ?? "Medium",
            })),
            xp_log: p.xp_log ?? {},
            sessions: p.sessions ?? [],
            rooms: p.rooms?.length ? p.rooms : seedRooms(),
            messages: p.messages?.length ? p.messages : seedMessages(),
            friends: p.friends?.length ? p.friends : seedFriends(),
          } as State;
        }
        return p as State;
      },
    },
  ),
);
