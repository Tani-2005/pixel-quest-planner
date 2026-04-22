import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PixelButton } from "@/components/PixelButton";

export interface TourStep {
  selector: string;
  title: string;
  body: string;
  emoji?: string;
}

interface Props {
  steps: TourStep[];
  storageKey?: string;
  onClose?: () => void;
}

const PADDING = 8;

export function OnboardingTour({ steps, storageKey = "pixelquest-tour-v1", onClose }: Props) {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(storageKey);
    if (!seen) {
      // small delay so the dashboard finishes mounting/animating
      const t = setTimeout(() => setActive(true), 600);
      return () => clearTimeout(t);
    }
  }, [storageKey]);

  // Position the spotlight on the current step's element
  useLayoutEffect(() => {
    if (!active) return;
    const update = () => {
      const step = steps[index];
      if (!step) return;
      const el = document.querySelector(step.selector) as HTMLElement | null;
      if (!el) {
        setRect(null);
        return;
      }
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Wait for scroll then measure
      requestAnimationFrame(() => setRect(el.getBoundingClientRect()));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active, index, steps]);

  const finish = () => {
    if (typeof window !== "undefined") localStorage.setItem(storageKey, "1");
    setActive(false);
    onClose?.();
  };

  if (!active || steps.length === 0) return null;
  const step = steps[index];
  const isLast = index === steps.length - 1;

  // Spotlight box: fall back to centered if element missing
  const box = rect
    ? {
        top: rect.top - PADDING,
        left: rect.left - PADDING,
        width: rect.width + PADDING * 2,
        height: rect.height + PADDING * 2,
      }
    : null;

  // Tooltip placement: prefer below; flip above if not enough room
  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;
  const tipWidth = Math.min(340, vw - 32);
  let tipTop = box ? box.top + box.height + 12 : vh / 2 - 80;
  let tipLeft = box ? box.left + box.width / 2 - tipWidth / 2 : vw / 2 - tipWidth / 2;
  if (box && tipTop + 200 > vh) tipTop = box.top - 200 - 12;
  tipLeft = Math.max(16, Math.min(tipLeft, vw - tipWidth - 16));

  return (
    <AnimatePresence>
      <motion.div
        key="tour"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] pointer-events-auto"
      >
        {/* Dim overlay using SVG mask for a hole */}
        <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <mask id="tour-hole">
              <rect width="100%" height="100%" fill="white" />
              {box && (
                <rect
                  x={box.left}
                  y={box.top}
                  width={box.width}
                  height={box.height}
                  rx="6"
                  ry="6"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(8, 5, 22, 0.78)"
            mask="url(#tour-hole)"
            onClick={finish}
          />
        </svg>

        {/* Glow ring around spotlight */}
        {box && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="absolute pointer-events-none border-2 border-pixel-cyan shadow-pixel-cyan rounded-md"
            style={box}
          />
        )}

        {/* Tooltip */}
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25 }}
          className="absolute bg-pixel-surface border-2 border-pixel-pink shadow-pixel-pink p-5"
          style={{ top: tipTop, left: tipLeft, width: tipWidth }}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              {step.emoji && <span className="text-xl">{step.emoji}</span>}
              <h3 className="font-pixel text-[10px] text-pixel-pink">{step.title}</h3>
            </div>
            <span className="font-pixel text-[8px] text-muted-foreground">
              {index + 1} / {steps.length}
            </span>
          </div>
          <p className="font-sans text-sm text-foreground/90 leading-relaxed">{step.body}</p>

          <div className="flex items-center justify-between mt-5">
            <button
              type="button"
              onClick={finish}
              className="font-pixel text-[8px] text-muted-foreground hover:text-pixel-cyan transition-colors"
            >
              Skip tour
            </button>
            <div className="flex items-center gap-2">
              {index > 0 && (
                <PixelButton variant="ghost" size="sm" onClick={() => setIndex((i) => i - 1)}>
                  ← Back
                </PixelButton>
              )}
              {isLast ? (
                <PixelButton variant="accent" size="sm" onClick={finish}>
                  ✓ Let&apos;s go!
                </PixelButton>
              ) : (
                <PixelButton variant="cyan" size="sm" onClick={() => setIndex((i) => i + 1)}>
                  Next →
                </PixelButton>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
