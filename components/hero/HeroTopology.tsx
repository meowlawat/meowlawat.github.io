"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
  verified: boolean;
  delay: number;
  label?: string;
}

interface Edge {
  a: number;
  b: number;
  signal: boolean;
  delay: number;
}

const VIEW_W = 600;
const VIEW_H = 520;

const LABELS = ["VERIFIED", "SIGNAL_02", "NODE_07", "SIGNAL_04", "NODE_03"];

// An orbital cluster rather than a scattered grid: nodes sit at varied
// radii/angles around a loose center, so it reads as one instrument
// rather than random dots.
function generateNodes(count: number): Node[] {
  const nodes: Node[] = [];
  const cx = VIEW_W * 0.55;
  const cy = VIEW_H * 0.42;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
    const radius = 60 + Math.random() * (VIEW_W * 0.42);
    const verified = Math.random() > 0.82;
    nodes.push({
      id: i,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius * 0.85,
      verified,
      delay: Math.random() * 0.9,
      label: Math.random() > 0.62 ? LABELS[i % LABELS.length] : undefined,
    });
  }
  return nodes;
}

function buildEdges(nodes: Node[], maxDist: number, signalCount: number): Edge[] {
  const raw: { a: number; b: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const nearest: { j: number; d: number }[] = [];
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue;
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist) nearest.push({ j, d });
    }
    nearest.sort((a, b) => a.d - b.d);
    for (const { j } of nearest.slice(0, 2)) {
      if (!raw.some((e) => (e.a === i && e.b === j) || (e.a === j && e.b === i))) {
        raw.push({ a: i, b: j });
      }
    }
  }
  const edges: Edge[] = raw.map((e) => ({ ...e, signal: false, delay: Math.random() * 1.1 + 0.3 }));
  const shuffled = [...edges].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(signalCount, shuffled.length); i++) {
    shuffled[i].signal = true;
  }
  return edges;
}

/**
 * The hero's living network topology — an orbital instrumentation
 * cluster, SVG rather than Canvas, sized to its own column (it's a
 * compositional element, not a full-bleed background). Nodes materialize
 * with a staggered formation animation and a single expanding "sweep"
 * ring, then settle into ambient signal-flow + pointer-proximity
 * brightening. Fully static (no formation, no listeners) under
 * prefers-reduced-motion.
 */
export function HeroTopology() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [graph, setGraph] = useState<{ nodes: Node[]; edges: Edge[] } | null>(
    null,
  );
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const svg = svgRef.current;
    const listenTarget = svg?.parentElement;
    if (!svg || !listenTarget) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReduceMotion(reduced);

    const isMobile = window.innerWidth < 640;
    const nodes = generateNodes(isMobile ? 9 : 15);
    const edges = buildEdges(nodes, isMobile ? 200 : 240, isMobile ? 2 : 4);
    setGraph({ nodes, edges });

    if (reduced) return;

    let raf = 0;
    let pending = false;

    function onPointerMove(e: globalThis.PointerEvent) {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(() => {
        pending = false;
        const rect = svg!.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * VIEW_W;
        const py = ((e.clientY - rect.top) / rect.height) * VIEW_H;

        for (const node of nodes) {
          const dx = node.x - px;
          const dy = node.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / 200);
          const el = svg!.querySelector<SVGCircleElement>(
            `[data-node="${node.id}"]`,
          );
          if (el) el.style.opacity = String(0.5 + proximity * 0.5);
        }
      });
    }

    listenTarget.addEventListener("pointermove", onPointerMove);
    return () => {
      listenTarget.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {/* Faint orbital rings — atmosphere even when nothing is moving. */}
      {[0.2, 0.32, 0.44].map((f) => (
        <circle
          key={f}
          cx={VIEW_W * 0.55}
          cy={VIEW_H * 0.42}
          r={VIEW_W * f}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={1}
          opacity={0.4}
        />
      ))}

      {!reduceMotion && graph ? (
        <circle
          cx={VIEW_W * 0.55}
          cy={VIEW_H * 0.42}
          r="4"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
          style={{ animation: "sweep-ring 1.6s cubic-bezier(0.16,1,0.3,1) both" }}
        />
      ) : null}

      {graph?.edges.map((edge, i) => {
        const a = graph.nodes[edge.a];
        const b = graph.nodes[edge.b];
        if (!a || !b) return null;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={a.verified || b.verified ? "var(--verified)" : "var(--accent)"}
            strokeOpacity={0.28}
            strokeWidth={1}
            pathLength={reduceMotion ? undefined : 1}
            className={edge.signal ? "signal-connection" : undefined}
            style={
              reduceMotion
                ? undefined
                : {
                    strokeDasharray: 1,
                    animation: `draw-in 0.8s cubic-bezier(0.16,1,0.3,1) ${edge.delay}s both`,
                  }
            }
          />
        );
      })}

      {graph?.nodes.map((node) => (
        <g key={node.id}>
          <circle
            data-node={node.id}
            cx={node.x}
            cy={node.y}
            r={node.verified ? 5.5 : 3.5}
            fill={node.verified ? "var(--verified)" : "var(--accent)"}
            opacity={reduceMotion ? 0.65 : 0}
            className={node.verified ? "node-pulse" : undefined}
            style={
              reduceMotion
                ? undefined
                : { animation: `node-form 0.6s cubic-bezier(0.16,1,0.3,1) ${node.delay}s forwards` }
            }
          />
          {node.label ? (
            <text
              x={node.x + 10}
              y={node.y - 8}
              className="fill-muted-2 font-mono"
              style={
                reduceMotion
                  ? { fontSize: 9, opacity: 0.8 }
                  : {
                      fontSize: 9,
                      animation: `label-form 0.6s cubic-bezier(0.16,1,0.3,1) ${node.delay + 0.2}s forwards`,
                    }
              }
            >
              {node.label}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
