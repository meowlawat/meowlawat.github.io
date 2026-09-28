"use client";

import { useRef } from "react";
import type React from "react";
import { useTransform, useReducedMotion, motion } from "motion/react";
import { useSceneProgress } from "@/lib/scroll";

/**
 * The connective tissue between scenes: a signal that leaves one scene and
 * enters the next. Drawn by scroll position, with its color shifting from
 * the outgoing scene's meaning to the incoming one's — the same read-head
 * that drives every pinned scene, so a fast flick through this gap never
 * teleports or desyncs from the scenes on either side of it.
 */
export function SignalThread({
  from,
  to,
  label,
}: {
  from: string;
  to: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const p = useSceneProgress(ref, ["start 85%", "end 35%"]);
  const scaleY = useTransform(p, [0, 1], [0, 1]);
  const color = useTransform(p, [0, 1], [from, to]);
  const top = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative ml-6 h-[38vh] md:ml-[6vw]"
    >
      <div className="absolute inset-y-0 left-0 w-px bg-border" />
      <motion.div
        style={{ "--sy": reduce ? 1 : scaleY, backgroundColor: color } as unknown as React.CSSProperties}
        className="absolute inset-y-0 left-0 w-px origin-top scale-y-[var(--sy)]"
      />
      {!reduce ? (
        <motion.span
          style={{ top, backgroundColor: color }}
          className="absolute left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_10px_2px_rgba(113,135,179,0.22)]"
        />
      ) : null}
      {label ? (
        <span className="absolute top-1/2 left-5 -translate-y-1/2 font-mono text-[10px] tracking-[0.16em] whitespace-nowrap text-muted-2">
          {label}
        </span>
      ) : null}
    </div>
  );
}
