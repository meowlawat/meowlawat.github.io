"use client";

import { useState, type CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { FAST } from "@/lib/motion";

export type NodeState = "idle" | "active" | "system" | "verified" | "degraded";
export type LinkState = "idle" | "signal" | "flow" | "verified" | "degraded";

export interface SceneNode {
  id: string;
  label: string;
  /** Desktop position, percent of the stage (x, y). */
  d: [number, number];
  /** Mobile position — its own composition, not a squeezed desktop. */
  m: [number, number];
  size?: number;
  state: NodeState;
  /** Revealed on hover / focus / tap — what this component actually does. */
  note?: string;
  /** Instrument readout anchored to the node (e.g. a metric). */
  tag?: string;
  /** Scroll-derived visibility of the tag; without it the tag is static. */
  tagOpacity?: MotionValue<number>;
  /** Mobile label side — nodes near the right edge put their label left. */
  mSide?: "left" | "right";
}

export interface SceneLink {
  from: string;
  to: string;
  state: LinkState;
}

/**
 * Something moving along a link, driven by a 0→1 progress value:
 * "grow" draws the link from `from` toward `to`; "pulse" carries a packet.
 */
export interface SceneTrace {
  from: string;
  to: string;
  progress: MotionValue<number>;
  kind: "grow" | "pulse";
  tone: "signal" | "verified" | "degraded";
}

const LINK_STROKE: Record<LinkState, string> = {
  idle: "var(--border-strong)",
  signal: "var(--accent)",
  flow: "var(--system)",
  verified: "var(--verified)",
  degraded: "var(--muted-2)",
};

const TRACE_STROKE: Record<SceneTrace["tone"], string> = {
  signal: "var(--accent)",
  verified: "var(--verified)",
  degraded: "var(--muted)",
};

const NODE_CLASS: Record<NodeState, string> = {
  idle: "border-border-strong bg-surface",
  active: "border-accent bg-accent-soft shadow-[0_0_0_8px_var(--accent-soft)]",
  system: "border-system bg-system-soft shadow-[0_0_0_8px_var(--system-soft)]",
  verified:
    "border-verified bg-verified-soft shadow-[0_0_0_10px_var(--verified-soft)]",
  degraded: "border-dashed border-muted-2 bg-surface opacity-60",
};

type XY = [number, number];

function GrowSegment({
  a,
  b,
  k,
  stroke,
  dashed,
}: {
  a: XY;
  b: XY;
  k: MotionValue<number>;
  stroke: string;
  dashed: boolean;
}) {
  const x2 = useTransform(k, (v) => a[0] + (b[0] - a[0]) * v);
  const y2 = useTransform(k, (v) => a[1] + (b[1] - a[1]) * v);
  const opacity = useTransform(k, [0, 0.03], [0, 1]);
  return (
    <motion.line
      x1={a[0]}
      y1={a[1]}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeDasharray={dashed ? "2 5" : undefined}
      vectorEffect="non-scaling-stroke"
      style={{ opacity }}
    />
  );
}

function Pulse({
  a,
  b,
  k,
  tone,
}: {
  a: SceneNode;
  b: SceneNode;
  k: MotionValue<number>;
  tone: SceneTrace["tone"];
}) {
  const opacity = useTransform(k, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  const at = (p: XY, q: XY, i: 0 | 1) => `calc((${p[i]} + ${q[i] - p[i]} * var(--k)) * 1%)`;
  const dot = cn(
    "pointer-events-none absolute z-20 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full",
    tone === "verified"
      ? "bg-verified shadow-[0_0_14px_3px_var(--verified-soft)]"
      : "bg-accent-foreground shadow-[0_0_14px_3px_var(--accent-soft)]",
  );
  return (
    <motion.div
      aria-hidden="true"
      style={{ "--k": k, opacity } as unknown as CSSProperties}
      className="pointer-events-none absolute inset-0"
    >
      <span className={cn(dot, "lg:hidden")} style={{ left: at(a.m, b.m, 0), top: at(a.m, b.m, 1) }} />
      <span className={cn(dot, "hidden lg:block")} style={{ left: at(a.d, b.d, 0), top: at(a.d, b.d, 1) }} />
    </motion.div>
  );
}

function NodeTag({
  text,
  opacity,
  className,
}: {
  text: string;
  opacity: MotionValue<number>;
  className: string;
}) {
  const y = useTransform(opacity, [0, 1], [5, 0]);
  return (
    <motion.span style={{ opacity, y }} className={className}>
      {text}
    </motion.span>
  );
}

/**
 * The shared visual grammar for every scene: nodes, links, state. Links are
 * SVG in a 0–100 viewBox stretched to the stage (so they line up exactly
 * with the percentage-positioned HTML nodes); nodes are real buttons so
 * their notes are reachable by keyboard and by tap on touch screens.
 */
export function SceneGraph({
  nodes,
  links,
  traces = [],
}: {
  nodes: SceneNode[];
  links: SceneLink[];
  traces?: SceneTrace[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  const always = useTransform(() => 1);
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="absolute inset-0">
      {(["d", "m"] as const).map((k) => (
        <svg
          key={k}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-full w-full",
            k === "d" ? "hidden lg:block" : "lg:hidden",
          )}
        >
          {links.map((l) => {
            const a = byId.get(l.from);
            const b = byId.get(l.to);
            if (!a || !b) return null;
            const moving = l.state !== "idle" && l.state !== "degraded";
            return (
              <line
                key={`${l.from}-${l.to}`}
                x1={a[k][0]}
                y1={a[k][1]}
                x2={b[k][0]}
                y2={b[k][1]}
                stroke={LINK_STROKE[l.state]}
                strokeWidth={l.state === "idle" ? 1 : 1.4}
                strokeDasharray={l.state === "degraded" ? "2 7" : undefined}
                vectorEffect="non-scaling-stroke"
                className={moving ? "signal-connection" : undefined}
                style={{
                  transition:
                    "stroke 900ms var(--ease-settle), stroke-width 900ms var(--ease-settle)",
                }}
              />
            );
          })}
          {traces
            .filter((t) => t.kind === "grow")
            .map((t) => {
              const a = byId.get(t.from);
              const b = byId.get(t.to);
              if (!a || !b) return null;
              return (
                <GrowSegment
                  key={`g-${t.from}-${t.to}`}
                  a={a[k]}
                  b={b[k]}
                  k={t.progress}
                  stroke={TRACE_STROKE[t.tone]}
                  dashed={t.tone === "degraded"}
                />
              );
            })}
        </svg>
      ))}

      {traces
        .filter((t) => t.kind === "pulse")
        .map((t) => {
          const a = byId.get(t.from);
          const b = byId.get(t.to);
          if (!a || !b) return null;
          return <Pulse key={`p-${t.from}-${t.to}`} a={a} b={b} k={t.progress} tone={t.tone} />;
        })}

      {nodes.map((n) => {
        const size = n.size ?? 18;
        const lit = open === n.id;
        const tagOpacity = n.tagOpacity ?? always;
        const pos = {
          "--dx": n.d[0],
          "--dy": n.d[1],
          "--mx": n.m[0],
          "--my": n.m[1],
        } as CSSProperties;
        return (
          <div
            key={n.id}
            style={pos}
            className="absolute top-[calc(var(--my)*1%)] left-[calc(var(--mx)*1%)] z-10 lg:top-[calc(var(--dy)*1%)] lg:left-[calc(var(--dx)*1%)]"
          >
            {n.tag ? (
              <NodeTag
                text={n.tag}
                opacity={tagOpacity}
                className="absolute bottom-full left-1/2 mb-3 hidden -translate-x-1/2 font-mono text-[11px] whitespace-nowrap text-accent-foreground lg:block"
              />
            ) : null}
            <motion.button
              type="button"
              aria-expanded={open === n.id}
              aria-label={`${n.label}${n.note ? ` — ${n.note}` : ""}`}
              onMouseEnter={() => setOpen(n.id)}
              onMouseLeave={() => setOpen(null)}
              onFocus={() => setOpen(n.id)}
              onBlur={() => setOpen(null)}
              onClick={() => setOpen(open === n.id ? null : n.id)}
              initial={false}
              animate={{ scale: lit ? 1.22 : n.state === "idle" ? 1 : 1.1 }}
              transition={FAST}
              style={{ width: size, height: size }}
              className={cn(
                // The visible node stays small; ::before extends the hit
                // area to a comfortable touch target.
                "relative -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-[1.5px] transition-[border-color,background-color,box-shadow,opacity] duration-700 ease-settle before:absolute before:-inset-3 before:rounded-full",
                NODE_CLASS[n.state],
                lit && "ring-1 ring-foreground/30 ring-offset-4 ring-offset-transparent",
              )}
            />
            <div
              className={cn(
                "pointer-events-none absolute -top-[7px] w-36 lg:top-5 lg:right-auto lg:left-0 lg:w-44 lg:-translate-x-1/2 lg:text-center",
                n.mSide === "left" ? "right-[calc(100%+1rem)] text-right" : "left-4",
              )}
            >
              <span
                className={cn(
                  "block font-mono text-[10px] tracking-[0.12em] uppercase transition-colors duration-700 ease-settle",
                  n.state === "idle" ? "text-muted-2" : "text-foreground",
                )}
              >
                {n.label}
              </span>
              {n.tag ? (
                <NodeTag
                  text={n.tag}
                  opacity={tagOpacity}
                  className="mt-1 block font-mono text-[11px] leading-snug text-accent-foreground lg:hidden"
                />
              ) : null}
              {n.note ? (
                <span
                  className={cn(
                    "mt-1 block text-[11px] leading-snug text-muted transition-[opacity,translate] duration-300 ease-settle",
                    lit ? "translate-y-0 opacity-100" : "-translate-y-0.5 opacity-0",
                  )}
                >
                  {n.note}
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
