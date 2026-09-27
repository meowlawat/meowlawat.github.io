"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
  verified: boolean;
}

interface Edge {
  a: number;
  b: number;
  signal: boolean;
}

const VIEW_W = 1000;
const VIEW_H = 640;

// Nodes are seeded into three zones — left wing, right wing, lower band —
// so the topology flanks the headline instead of sitting flatly behind it.
// The central-upper band (roughly where "Hardik Ahlawat" renders) stays
// sparse by construction.
function generateNodes(count: number): Node[] {
  const nodes: Node[] = [];
  const zones = [
    { x: [30, 260], y: [40, 560] }, // left wing
    { x: [740, 970], y: [40, 560] }, // right wing
    { x: [280, 720], y: [430, 600] }, // lower band, under the headline
  ];
  for (let i = 0; i < count; i++) {
    const zone = zones[i % zones.length];
    nodes.push({
      id: i,
      x: zone.x[0] + Math.random() * (zone.x[1] - zone.x[0]),
      y: zone.y[0] + Math.random() * (zone.y[1] - zone.y[0]),
      verified: Math.random() > 0.8,
    });
  }
  return nodes;
}

function buildEdges(nodes: Node[], maxDist: number, signalCount: number): Edge[] {
  const edges: Edge[] = [];
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
      if (!edges.some((e) => (e.a === i && e.b === j) || (e.a === j && e.b === i))) {
        edges.push({ a: i, b: j, signal: false });
      }
    }
  }
  const shuffled = [...edges].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(signalCount, shuffled.length); i++) {
    shuffled[i].signal = true;
  }
  return edges;
}

/**
 * The hero's living network topology — SVG, not Canvas, specifically so it
 * can participate in the composition (nodes flank the headline) rather than
 * sit as a flat decorative layer. Pointer proximity brightens nearby nodes
 * via direct DOM writes (no React re-renders on pointermove). Generated
 * once client-side (random layout, so this never runs during SSR) and
 * fully static — no listeners, no rAF loop — under prefers-reduced-motion.
 */
export function HeroTopology() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [graph, setGraph] = useState<{ nodes: Node[]; edges: Edge[] } | null>(
    null,
  );

  useEffect(() => {
    const svg = svgRef.current;
    // The SVG itself is pointer-events-none (it must not intercept clicks
    // meant for hero content above it), so the listener lives on its
    // parent — the hero <section> — instead.
    const listenTarget = svg?.parentElement;
    if (!svg || !listenTarget) return;

    const isMobile = window.innerWidth < 640;
    const nodes = generateNodes(isMobile ? 11 : 22);
    const edges = buildEdges(nodes, isMobile ? 160 : 130, isMobile ? 2 : 5);
    setGraph({ nodes, edges });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

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
          const proximity = Math.max(0, 1 - dist / 220);
          const el = svg!.querySelector<SVGCircleElement>(
            `[data-node="${node.id}"]`,
          );
          if (el) el.style.opacity = String(0.45 + proximity * 0.55);
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
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-80"
    >
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
            strokeOpacity={0.16}
            strokeWidth={1}
            className={edge.signal ? "signal-connection" : undefined}
          />
        );
      })}
      {graph?.nodes.map((node) => (
        <circle
          key={node.id}
          data-node={node.id}
          cx={node.x}
          cy={node.y}
          r={node.verified ? 3.2 : 2.4}
          fill={node.verified ? "var(--verified)" : "var(--accent)"}
          opacity={0.55}
          className={node.verified ? "node-pulse" : undefined}
        />
      ))}
    </svg>
  );
}
