import type { Architecture } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Server component — pure CSS animation (see `diagram-pulse` in
 * globals.css), so this ships zero client JS. The global
 * prefers-reduced-motion rule already collapses the animation duration to
 * near-zero, so reduced motion is handled without any JS branching here.
 */
export function ArchitectureDiagram({
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
        "flex flex-col items-stretch gap-0 rounded-lg border border-border bg-surface/60 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:p-6",
        className,
      )}
      role="group"
      aria-label="System architecture diagram"
    >
      {nodes.map((node, i) => (
        <div
          key={node.id}
          className="flex flex-col items-stretch sm:flex-row sm:items-center"
        >
          <div className="flex min-w-[9.5rem] flex-1 flex-col items-center gap-1 rounded-md border border-border-strong bg-surface px-4 py-3 text-center">
            <span className="font-mono text-[10px] tracking-[0.14em] text-muted-2">
              {String(i + 1).padStart(2, "0")}
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
              className="relative my-1.5 h-6 w-px self-center bg-border-strong sm:my-0 sm:h-px sm:w-8"
              aria-hidden="true"
            >
              <span
                className="absolute top-1/2 left-1/2 size-1.5 rounded-full bg-accent motion-reduce:hidden"
                style={{
                  animation: "diagram-pulse 2.2s ease-in-out infinite",
                  animationDelay: `${i * 0.35}s`,
                }}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
