"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";

interface Node {
  id: number;
  x: number;
  y: number;
  verified: boolean;
  front: boolean;
  delay: number;
  label?: string;
}

interface Edge {
  a: number;
  b: number;
  signal: boolean;
  delay: number;
}

const VIEW_W = 1600;
const VIEW_H = 900;
const CX = 1120;
const CY = 400;
const LABELS = ["VERIFIED", "SIGNAL_02", "NODE_07", "SIGNAL_04", "NODE_03", "TEE", "EDGE_PE1"];

// An orbital field centered right-of-middle and larger than the viewport,
// so nodes run off the edges — an environment, not a framed diagram.
function generateNodes(count: number): Node[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const radius = 90 + Math.random() * 820;
    return {
      id: i,
      x: CX + Math.cos(angle) * radius * 1.15,
      y: CY + Math.sin(angle) * radius * 0.62,
      verified: Math.random() > 0.84,
      front: i % 6 === 0,
      delay: Math.random() * 1.1,
      label: Math.random() > 0.72 ? LABELS[i % LABELS.length] : undefined,
    };
  });
}

function buildEdges(nodes: Node[], maxDist: number, signals: number): Edge[] {
  const raw: { a: number; b: number }[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const near = nodes
      .map((n, j) => ({ j, d: Math.hypot(nodes[i].x - n.x, nodes[i].y - n.y) }))
      .filter(({ j, d }) => j !== i && d < maxDist)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    for (const { j } of near) {
      if (!raw.some((e) => (e.a === i && e.b === j) || (e.a === j && e.b === i))) raw.push({ a: i, b: j });
    }
  }
  const edges = raw.map((e) => ({ ...e, signal: false, delay: Math.random() * 1.2 + 0.3 }));
  [...edges].sort(() => Math.random() - 0.5).slice(0, signals).forEach((e) => (e.signal = true));
  return edges;
}

/**
 * The hero environment. Two SVG layers share one generated graph: a
 * slightly blurred background field (behind the name) and a few crisp
 * foreground nodes + traveling signals (in front of it), so the type sits
 * *inside* the system rather than on top of a picture of one. Nodes form
 * on load, a ring sweeps once, signals travel along edges, and pointer
 * proximity brightens nearby nodes. Fully static under reduced motion.
 *
 * `depth` (0→1 as the hero scrolls out of view) drives a very subtle
 * differential parallax: the background field drifts less than the
 * foreground layer, so the environment reads as having depth without
 * ever announcing itself as a parallax effect.
 */
export function HeroTopology({ depth }: { depth?: MotionValue<number> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<SVGSVGElement>(null);
  const [graph, setGraph] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);
  const [reduce, setReduce] = useState(false);
  const zero = useTransform(() => 0);
  const d = depth ?? zero;
  const bgY = useTransform(d, [0, 1], ["0vh", "5vh"]);
  const fgY = useTransform(d, [0, 1], ["0vh", "13vh"]);

  useEffect(() => {
    const svg = backRef.current;
    const target = rootRef.current;
    if (!svg || !target) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(reduced);
    const mobile = window.innerWidth < 768;
    const nodes = generateNodes(mobile ? 18 : 36);
    const edges = buildEdges(nodes, mobile ? 380 : 300, mobile ? 3 : 7);
    setGraph({ nodes, edges });
    if (reduced) return;

    let raf = 0;
    let pending = false;
    function onMove(e: globalThis.PointerEvent) {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(() => {
        pending = false;
        const rect = svg!.getBoundingClientRect();
        // Account for xMidYMid slice: the viewBox is scaled to cover.
        const scale = Math.max(rect.width / VIEW_W, rect.height / VIEW_H);
        const ox = (rect.width - VIEW_W * scale) / 2;
        const oy = (rect.height - VIEW_H * scale) / 2;
        const px = (e.clientX - rect.left - ox) / scale;
        const py = (e.clientY - rect.top - oy) / scale;
        for (const n of nodes) {
          const prox = Math.max(0, 1 - Math.hypot(n.x - px, n.y - py) / 260);
          const el = target!.querySelector<SVGCircleElement>(`[data-node="${n.id}"]`);
          if (el) el.style.opacity = String(0.45 + prox * 0.55);
        }
      });
    }
    target.addEventListener("pointermove", onMove);
    return () => {
      target.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const svgProps = {
    viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true,
  } as const;

  const nodeCircle = (n: Node, r: number) => (
    <circle
      key={n.id}
      data-node={n.id}
      cx={n.x}
      cy={n.y}
      r={r}
      fill={n.verified ? "var(--verified)" : "var(--accent)"}
      opacity={reduce ? 0.6 : 0}
      className={n.verified ? "node-pulse" : undefined}
      style={
        reduce
          ? undefined
          : {
              animation: `node-form 0.7s cubic-bezier(0.16,1,0.3,1) ${n.delay}s forwards`,
              transition: "opacity 320ms var(--ease-settle)",
            }
      }
    />
  );

  return (
    <div ref={rootRef} className="contents">
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
      <svg
        ref={backRef}
        {...svgProps}
        className="pointer-events-none absolute inset-0 h-full w-full blur-[0.6px]"
      >
        {[180, 300, 440, 620].map((r) => (
          <ellipse
            key={r}
            cx={CX}
            cy={CY}
            rx={r * 1.15}
            ry={r * 0.62}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth={1}
            opacity={0.5}
          />
        ))}
        {!reduce && graph ? (
          <circle
            cx={CX}
            cy={CY}
            r="4"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            style={{ animation: "sweep-ring 1.8s cubic-bezier(0.16,1,0.3,1) both" }}
          />
        ) : null}
        {graph?.edges.map((e, i) => {
          const a = graph.nodes[e.a];
          const b = graph.nodes[e.b];
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={a.verified || b.verified ? "var(--verified)" : "var(--accent)"}
              strokeOpacity={0.3}
              strokeWidth={1}
              pathLength={reduce ? undefined : 1}
              className={e.signal ? "signal-connection" : undefined}
              style={
                reduce
                  ? undefined
                  : { strokeDasharray: 1, animation: `draw-in 0.9s cubic-bezier(0.16,1,0.3,1) ${e.delay}s both` }
              }
            />
          );
        })}
        {graph?.nodes.filter((n) => !n.front).map((n) => nodeCircle(n, n.verified ? 5 : 3.2))}
        {graph?.nodes
          .filter((n) => n.label && !n.front)
          .map((n) => (
            <text
              key={`l${n.id}`}
              x={n.x + 12}
              y={n.y - 10}
              className="fill-muted-2 font-mono"
              style={
                reduce
                  ? { fontSize: 11, opacity: 0.8 }
                  : { fontSize: 11, animation: `label-form 0.6s ease ${n.delay + 0.3}s forwards`, opacity: 0 }
              }
            >
              {n.label}
            </text>
          ))}
      </svg>
      </motion.div>

      {/* Foreground layer: crisp nodes and traveling signals in front of the type. */}
      <motion.div style={{ y: fgY }} className="absolute inset-0 z-20">
      <svg {...svgProps} className="pointer-events-none absolute inset-0 h-full w-full">
        {graph?.nodes.filter((n) => n.front).map((n) => nodeCircle(n, n.verified ? 7 : 5))}
        {!reduce &&
          graph?.edges
            .filter((e) => e.signal)
            .map((e, i) => {
              const a = graph.nodes[e.a];
              const b = graph.nodes[e.b];
              return (
                <circle key={`s${i}`} r={3} fill="var(--accent-foreground)" opacity={0.9}>
                  <animateMotion
                    dur={`${3.2 + i * 0.7}s`}
                    repeatCount="indefinite"
                    path={`M${a.x},${a.y} L${b.x},${b.y}`}
                  />
                </circle>
              );
            })}
      </svg>
      </motion.div>
    </div>
  );
}
