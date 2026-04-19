import { subjectColor } from "@/lib/store";

const colorMap: Record<string, string> = {
  "pixel-cyan": "border-pixel-cyan text-pixel-cyan",
  "pixel-pink": "border-pixel-pink text-pixel-pink",
  "pixel-gold": "border-pixel-gold text-pixel-gold",
  "pixel-green": "border-pixel-green text-pixel-green",
  "pixel-purple": "border-pixel-purple text-pixel-purple",
  "pixel-red": "border-pixel-red text-pixel-red",
};

const dotMap: Record<string, string> = {
  "pixel-cyan": "bg-pixel-cyan",
  "pixel-pink": "bg-pixel-pink",
  "pixel-gold": "bg-pixel-gold",
  "pixel-green": "bg-pixel-green",
  "pixel-purple": "bg-pixel-purple",
  "pixel-red": "bg-pixel-red",
};

export function SubjectTag({ subject, size = "sm" }: { subject: string; size?: "sm" | "md" }) {
  const c = subjectColor(subject);
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-pixel ${
        size === "sm" ? "text-[8px] px-2 py-1" : "text-[10px] px-3 py-1.5"
      } border ${colorMap[c]}`}
    >
      <span className={`w-1.5 h-1.5 ${dotMap[c]}`} />
      {subject}
    </span>
  );
}

export function subjectStripeClass(subject: string) {
  const c = subjectColor(subject);
  return dotMap[c];
}
