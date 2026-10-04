"use client";

import type { RefObject } from "react";
import {
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SCROLL_DIRECT, SCROLL_FOLLOW } from "@/lib/motion";

type Offset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>["offset"]>;

/**
 * A scene's single source of truth: 0→1 progress through `ref`, followed by
 * a critically damped spring. Everything visual derives from this value, so
 * the scene tracks scroll speed, reverses with the reader, and can never
 * queue animations. (Routing through a spring also keeps Motion from
 * hardware-accelerating the mapping onto a native scroll timeline, which
 * mis-maps target offsets.)
 */
export function useSceneProgress(
  ref: RefObject<HTMLElement | null>,
  offset: Offset = ["start start", "end end"],
): MotionValue<number> {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  return useSpring(scrollYProgress, reduce ? SCROLL_DIRECT : SCROLL_FOLLOW);
}

/**
 * 0→1 while `v` crosses [a, b]; if [c, d] is given, back to 0 across it.
 * The building block for anything that should emerge and recede with scroll.
 */
export function useBand(
  v: MotionValue<number>,
  a: number,
  b: number,
  c?: number,
  d?: number,
): MotionValue<number> {
  return useTransform(
    v,
    c === undefined || d === undefined ? [a, b] : [a, b, c, d],
    c === undefined || d === undefined ? [0, 1] : [0, 1, 1, 0],
  );
}

/**
 * A staircase with eased risers: holds each integer, then glides to the next
 * across a window of width `w` centered on the boundary. Captions use it so
 * they dwell while you read and move only while the state is changing.
 */
export function smoothSteps(v: number, w = 0.3): number {
  const k = Math.round(v);
  const d = v - k;
  if (d <= -w / 2) return k - 1;
  if (d >= w / 2) return k;
  const e = (d + w / 2) / w;
  return k - 1 + e * e * (3 - 2 * e);
}
