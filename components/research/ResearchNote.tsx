import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResearchProject } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The compact treatment — a research note, not a case study. Metrics run
 * inline as a single mono sequence instead of a grid; no diagram.
 */
export function ResearchNote({ research }: { research: ResearchProject }) {
  return (
    <Reveal>
      <Link
        href={`/research/${research.slug}`}
        className="group grid gap-4 border-t border-border py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-8"
      >
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-muted-2">
              {research.year}
            </span>
            <span className="font-mono text-[11px] text-accent">
              {research.status}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-foreground transition-colors duration-200 group-hover:text-accent">
            {research.title}
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
            {research.description}
          </p>
          <p className="mt-2 font-mono text-xs text-muted-2">
            {research.metrics.map((m) => `${m.value} ${m.label}`).join("  ·  ")}
          </p>
        </div>

        <span className="inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap text-foreground">
          Read note
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </Reveal>
  );
}
