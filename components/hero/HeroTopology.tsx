"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
  verified: boolean;
  delay: number;
}

interface Edge {
  a: number;
  b: number;
  signal: boolean;
  delay: number;
}

const VIEW_W = 1000;
const VIEW_H = 640;

// Nodes are seeded into three zones — left wing, right wing, lower band —
// so the topology flanks the headline instead of sitting flatly behind it.
// The central-upper band (roughly where the name renders) stays sparse by
// construction.
function generateNodes(count: number): Node[] {
  const nodes: Node[] = [];
  const zones = [
    { x: [20, 300], y: [30, 610] }, // left wing
    { x: [700, 980], y: [30, 610] }, // right wing
    { x: [260, 740], y: [470, 615] }, // lower band, under the headline
  ];
  for (let i = 0; i < count; i++) {
    const zone = zones[i % zones.length];
    nodes.push({
      id: i,
      x: zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]),
      y: zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]),
      verified: Math.random() > 0.8,
      delay: Math.random() * 0.9,
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
 * The hero's living network topology — SVG, not Canvas, so it can
 * participate in the composition (nodes flank the headline) rather than
 * sit as a flat decorative layer. On mount, nodes/edges materialize with a
 * staggered formation animation and a single expanding "sweep" ring, then
 * settle into ambient signal-flow + pointer-proximity brightening. Fully
 * static (no formation, no listeners) under prefers-reduced-motion.
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
    const nodes = generateNodes(isMobile ? 12 : 26);
    const edges = buildEdges(nodes, isMobile ? 170 : 150, isMobile ? 2 : 6);
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
          const proximity = Math.max(0, 1 - dist / 240);
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
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    >
      {!reduceMotion && graph ? (
        <circle
          cx={VIEW_W / 2}
          cy={VIEW_H / 2}
          r="4"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
          style={{
            animation: "sweep-ring 1.6s cubic-bezier(0.16,1,0.3,1) both",
          }}
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
            stroke={
              a.verified || b.verified ? "var(--verified)" : "var(--accent)"
            }
            strokeOpacity={0.22}
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
        <circle
          key={node.id}
          data-node={node.id}
          cx={node.x}
          cy={node.y}
          r={node.verified ? 3.6 : 2.6}
          fill={node.verified ? "var(--verified)" : "var(--accent)"}
          opacity={reduceMotion ? 0.6 : 0}
          className={node.verified ? "node-pulse" : undefined}
          style={
            reduceMotion
              ? undefined
              : {
                  animation: `node-form 0.6s cubic-bezier(0.16,1,0.3,1) ${node.delay}s forwards`,
                }
          }
        />
      ))}
    </svg>
  );
}
