"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * Wraps a top-level section so it settles in as it enters the viewport
 * and recedes (fades + scales down slightly, as if sinking behind what
 * follows) as it scrolls past — independent per section, no pinning, no
 * scroll-jacking. Because each section tracks its own scroll progress,
 * the outgoing section's fade-out and the next section's fade-in
 * naturally overlap: the cross-fade "new content arriving as the old
 * recedes" effect falls out of that overlap, not from any explicit
 * choreography between the two.
 */
export function ScrollFade({
  children,
  exitFade = true,
}: {
  children: ReactNode;
  exitFade?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, exitFade ? 0.4 : 1],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.97, 1, 1, exitFade ? 0.97 : 1],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [28, 0, 0, exitFade ? -14 : 0],
  );

  return (
    <motion.div ref={ref} style={reduceMotion ? undefined : { opacity, scale, y }}>
      {children}
    </motion.div>
  );
}
