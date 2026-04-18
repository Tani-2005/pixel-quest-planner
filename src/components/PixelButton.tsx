import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent" | "cyan" | "gold" | "danger" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}

const variants: Record<Variant, string> = {
  primary:
    "bg-pixel-purple text-white border-pixel-pink shadow-pixel-pink",
  secondary:
    "bg-pixel-surface text-foreground border-pixel-purple shadow-pixel",
  accent:
    "bg-pixel-pink text-white border-pixel-purple shadow-pixel",
  cyan:
    "bg-pixel-cyan text-[oklch(0.18_0.08_295)] border-pixel-purple shadow-pixel",
  gold:
    "bg-pixel-gold text-[oklch(0.18_0.08_295)] border-pixel-purple shadow-pixel",
  danger:
    "bg-pixel-red text-white border-pixel-purple shadow-pixel",
  ghost:
    "bg-transparent text-foreground border-pixel-purple",
};

const sizes = {
  sm: "px-3 py-2 text-[10px]",
  md: "px-5 py-3 text-xs",
  lg: "px-7 py-4 text-sm",
};

export const PixelButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-pixel inline-flex items-center justify-center gap-2 border-2 select-none cursor-pointer pixel-press whitespace-nowrap",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
PixelButton.displayName = "PixelButton";
