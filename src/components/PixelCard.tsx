import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  accent?: "purple" | "pink" | "cyan" | "gold";
}

const borderMap = {
  purple: "border-pixel-purple shadow-pixel",
  pink: "border-pixel-pink shadow-pixel-pink",
  cyan: "border-pixel-cyan shadow-pixel-cyan",
  gold: "border-pixel-gold shadow-pixel-gold",
};

export function PixelCard({ className, accent = "purple", children, ...props }: Props) {
  return (
    <div
      className={cn(
        "bg-pixel-surface border-2 p-5",
        borderMap[accent],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
