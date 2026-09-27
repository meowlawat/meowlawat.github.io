import type { Architecture } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * The Signal Lab visual grammar: NODE → CONNECTION → SIGNAL → STATE.
 * Server component — every animation here is pure CSS (signal-flow dash
 * scroll, node-glow pulse, both defined in globals.css and neutralized
 * under prefers-reduced-motion), so this ships zero client JS regardless
 * of how many diagrams a page renders.
 *
 * Color carries meaning: blue (default) = signal/information, lime
 * ("verified") = a trusted/validated step. Orange never appears here —
 * it's reserved for the Security Findings section.
 */
export function NetworkDiagram({
  architecture,
  className,
}: {
  architecture: Architecture;
  className?: string;
}) {
  const { nodes } = architecture;

  return (
    <div
      className={cn(
        "group/diagram flex flex-col items-stretch gap-0 rounded-lg border border-border bg-surface/60 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:p-6",
        className,
      )}
      role="group"
      aria-label="System architecture diagram"
    >
      {nodes.map((node, i) => {
        const verified = node.state === "verified";
        return (
          <div
            key={node.id}
            className="flex flex-col items-stretch sm:flex-row sm:items-center"
          >
            <div
              className={cn(
                "relative flex min-w-[7.5rem] flex-1 flex-col items-center gap-1.5 rounded-md border bg-surface px-3 py-3 text-center transition-colors duration-200",
                verified
                  ? "border-verified-border group-hover/diagram:border-verified"
                  : "border-border-strong group-hover/diagram:border-accent-border",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "node-pulse size-1.5 rounded-full",
                    verified ? "bg-verified" : "bg-accent",
                  )}
                  aria-hidden="true"
                />
                <span className="font-mono text-[10px] tracking-[0.14em] text-muted-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="text-sm font-medium text-balance text-foreground">
                {node.label}
              </span>
              {node.description ? (
                <span className="text-xs text-muted">{node.description}</span>
              ) : null}
            </div>

            {i < nodes.length - 1 ? (
              <div
                className="relative my-1.5 h-6 w-6 self-center sm:my-0 sm:h-6 sm:w-8"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 32 24"
                  className="h-full w-full rotate-90 sm:rotate-0"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="0"
                    y1="12"
                    x2="32"
                    y2="12"
                    stroke="var(--border-strong)"
                    strokeWidth="1.5"
                    className="signal-connection transition-colors duration-200 group-hover/diagram:stroke-accent"
                  />
                </svg>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
