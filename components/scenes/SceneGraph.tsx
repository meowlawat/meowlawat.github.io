"use client";

import { useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SPRING_SOFT } from "@/lib/motion";

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
  /** Tiny mono readout above the node (e.g. a metric), shown when set. */
  tag?: string;
  /** Mobile label side — nodes near the right edge put their label left. */
  mSide?: "left" | "right";
}

export interface SceneLink {
  from: string;
  to: string;
  state: LinkState;
}

const LINK_STROKE: Record<LinkState, string> = {
  idle: "var(--border-strong)",
  signal: "var(--accent)",
  flow: "var(--system)",
  verified: "var(--verified)",
  degraded: "var(--muted-2)",
};

const NODE_CLASS: Record<NodeState, string> = {
  idle: "border-border-strong bg-surface",
  active: "border-accent bg-accent-soft shadow-[0_0_0_8px_var(--accent-soft)]",
  system: "border-system bg-system-soft shadow-[0_0_0_8px_var(--system-soft)]",
  verified:
    "border-verified bg-verified-soft shadow-[0_0_0_10px_var(--verified-soft)]",
  degraded: "border-dashed border-muted-2 bg-surface opacity-60",
};

/**
 * The shared visual grammar for every scene: nodes, links, state. Links are
 * SVG in a 0–100 viewBox stretched to the stage (so they line up exactly
 * with the percentage-positioned HTML nodes); nodes are real buttons so
 * their notes are reachable by keyboard and by tap on touch screens.
 */
export function SceneGraph({
  nodes,
  links,
  highlight,
  onHover,
}: {
  nodes: SceneNode[];
  links: SceneLink[];
  highlight?: string | null;
  onHover?: (id: string | null) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const byId = new Map(nodes.map((n) => [n.id, n]));

  function reveal(id: string | null) {
    setOpen(id);
    onHover?.(id);
  }

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
                strokeWidth={l.state === "idle" ? 1 : 1.6}
                strokeDasharray={l.state === "degraded" ? "2 7" : undefined}
                vectorEffect="non-scaling-stroke"
                className={moving ? "signal-connection" : undefined}
                style={{ transition: "stroke 500ms ease, stroke-width 500ms ease" }}
              />
            );
          })}
        </svg>
      ))}

      {nodes.map((n) => {
        const size = n.size ?? 18;
        const lit = open === n.id || highlight === n.id;
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
              <span className="absolute bottom-full left-1/2 mb-3 hidden -translate-x-1/2 font-mono text-[11px] whitespace-nowrap text-accent-foreground lg:block">
                {n.tag}
              </span>
            ) : null}
            <motion.button
              type="button"
              aria-expanded={open === n.id}
              aria-label={`${n.label}${n.note ? ` — ${n.note}` : ""}`}
              onMouseEnter={() => reveal(n.id)}
              onMouseLeave={() => reveal(null)}
              onFocus={() => reveal(n.id)}
              onBlur={() => reveal(null)}
              onClick={() => reveal(open === n.id ? null : n.id)}
              animate={{ scale: n.state === "idle" ? 1 : lit ? 1.35 : 1.18 }}
              transition={SPRING_SOFT}
              style={{ width: size, height: size }}
              className={cn(
                "-translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border-[1.5px] transition-[border-color,background-color,box-shadow,opacity] duration-500",
                NODE_CLASS[n.state],
                lit && "ring-1 ring-foreground/40 ring-offset-4 ring-offset-transparent",
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
                  "block font-mono text-[10px] tracking-[0.12em] uppercase transition-colors duration-500",
                  n.state === "idle" ? "text-muted-2" : "text-foreground",
                )}
              >
                {n.label}
              </span>
              {n.tag ? (
                <span className="mt-1 block font-mono text-[11px] leading-snug text-accent-foreground lg:hidden">
                  {n.tag}
                </span>
              ) : null}
              {n.note ? (
                <span
                  className={cn(
                    "mt-1 block text-[11px] leading-snug text-muted transition-opacity duration-300",
                    lit ? "opacity-100" : "opacity-0",
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
