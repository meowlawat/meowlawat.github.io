import type { Architecture } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The Signal Lab visual grammar: NODE -> CONNECTION -> SIGNAL -> STATE,
 * as an orbital/organic layout rather than a straight pipeline of boxes.
 * Server component — every animation here is pure CSS (signal-flow dash
 * scroll, node-glow pulse, both in globals.css, neutralized under
 * prefers-reduced-motion), so this ships zero client JS no matter how
 * many diagrams a page renders.
 *
 * Coordinates are normalized to a 0-100-wide space and the SVG sizes
 * itself from its own viewBox aspect ratio (width:100% + height:auto) —
 * labels are a separate HTML overlay positioned by the same percentages,
 * specifically so they never shrink illegibly the way SVG <text> would
 * if it scaled down with the diagram on narrow viewports.
 *
 * Color carries meaning: cobalt (default) = signal/information, sage
 * ("verified") = a trusted/validated step — verified nodes also render
 * larger with a soft glow, since they're the ones worth noticing first.
 * Rust never appears here; it's reserved for Security Findings.
 */
export function NetworkDiagram({
  architecture,
  eyebrow,
  footnoteLeft,
  footnoteRight,
  large = false,
  className,
}: {
  architecture: Architecture;
  eyebrow?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  large?: boolean;
  className?: string;
}) {
  const { nodes, edges } = architecture;
  const H = large ? 46 : 32;
  const marginX = 8;
  const centerY = H / 2;
  const step = (100 - marginX * 2) / Math.max(nodes.length - 1, 1);

  // Deterministic organic zigzag — not a straight row, not randomized
  // (stays server-rendered and reproducible). Amplitude/direction vary
  // by index so the layout reads as a loose graph, not a grid.
  const positions = nodes.map((node, i) => {
    const dir = i % 2 === 0 ? -1 : 1;
    const amplitude = (H / 2 - 7) * (0.55 + (i % 3) * 0.22);
    const isBig = node.state === "verified";
    return {
      node,
      x: marginX + step * i,
      y: centerY + dir * amplitude,
      r: isBig ? (large ? 2.6 : 2.1) : large ? 1.5 : 1.15,
    };
  });

  const byId = new Map(positions.map((p) => [p.node.id, p]));

  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-surface/50 pt-10 pb-4 sm:pt-12",
        className,
      )}
    >
      {eyebrow ? (
        <span className="absolute top-4 left-4 z-10 font-mono text-[10px] tracking-[0.14em] text-muted-2 sm:top-5 sm:left-5">
          {eyebrow}
        </span>
      ) : null}

      <div className="relative px-6 sm:px-10">
        <svg
          viewBox={`0 0 100 ${H}`}
          className="block h-auto w-full"
          role="group"
          aria-label="System architecture diagram"
        >
          {edges.map((edge, i) => {
            const a = byId.get(edge.from);
            const b = byId.get(edge.to);
            if (!a || !b) return null;
            const verified =
              a.node.state === "verified" || b.node.state === "verified";
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={verified ? "var(--verified)" : "var(--accent)"}
                strokeWidth={0.3}
                strokeOpacity={0.45}
                vectorEffect="non-scaling-stroke"
                className="signal-connection"
              />
            );
          })}

          {positions.map(({ node, x, y, r }) => {
            const verified = node.state === "verified";
            const color = verified ? "var(--verified)" : "var(--accent)";
            return (
              <g key={node.id}>
                {verified ? (
                  <circle
                    cx={x}
                    cy={y}
                    r={r * 1.9}
                    fill={color}
                    opacity={0.14}
                    className="node-pulse"
                  />
                ) : null}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={verified ? "var(--verified-soft)" : "var(--surface)"}
                  stroke={color}
                  strokeWidth={0.35}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}
        </svg>

        {/* Label overlay — sized in real px, independent of SVG scale.
            Same padded box as the svg above (absolute inset-0 fills the
            parent's padding box exactly), so percentages line up. */}
        <div className="pointer-events-none absolute inset-0">
          {positions.map(({ node, x, y, r }) => (
            <span
              key={node.id}
              className="absolute max-w-[6rem] -translate-x-1/2 text-center font-sans text-[10px] leading-tight text-balance text-foreground sm:max-w-[7rem] sm:text-[11px]"
              style={{
                left: `${x}%`,
                top: `${(y / H) * 100}%`,
                marginTop: `${(r / H) * 100}%`,
                paddingTop: 6,
              }}
            >
              {node.label}
            </span>
          ))}
        </div>
      </div>

      {footnoteLeft || footnoteRight ? (
        <div className="mt-3 flex items-center justify-between px-6 font-mono text-[10px] tracking-[0.1em] text-muted-2 sm:px-10">
          <span>{footnoteLeft}</span>
          <span className="text-verified">{footnoteRight}</span>
        </div>
      ) : null}
    </div>
  );
}
