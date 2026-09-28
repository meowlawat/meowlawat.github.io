"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, type MotionValue } from "motion/react";
import { MEDIUM } from "@/lib/motion";

/**
 * The live caption for a scroll scene. `pos` is a continuous caption index
 * (smoothSteps of the scene's progress): it dwells mid-state and glides
 * only while the state is genuinely changing, so the counter and the text
 * beneath it flip together, once, at the glide's midpoint — never two
 * captions stacked and cross-fading over each other. Screen readers get
 * the full ordered list regardless of scroll position.
 */
export function CaptionReel({
  items,
  pos,
  note,
  minHeightClass = "min-h-[4.5rem] lg:min-h-[3.5rem]",
}: {
  items: string[];
  pos: MotionValue<number>;
  note?: string;
  minHeightClass?: string;
}) {
  const [n, setN] = useState(0);
  useMotionValueEvent(pos, "change", (p) => setN(Math.min(items.length - 1, Math.max(0, Math.round(p)))));

  return (
    <div>
      <span className="font-mono text-[10px] tracking-[0.14em] text-muted-2">
        STATE {String(n + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        {note ? ` · ${note}` : ""}
      </span>
      <div className={`relative mt-2 ${minHeightClass}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={n}
            aria-hidden="true"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={MEDIUM}
            className="absolute inset-x-0 top-0 text-sm leading-relaxed text-foreground/90 lg:text-base"
          >
            {items[n]}
          </motion.p>
        </AnimatePresence>
      </div>
      <ol className="sr-only">
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ol>
    </div>
  );
}
