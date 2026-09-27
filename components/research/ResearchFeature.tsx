import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResearchProject } from "@/lib/types";
import { TagRow } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { NetworkDiagram } from "@/components/architecture/NetworkDiagram";

/**
 * The one research entry given hero-like visual weight. Metrics read as
 * instrument annotations beneath the diagram (a top tick + big mono
 * number + label) rather than a boxed grid — the diagram is the subject,
 * the numbers are what it's reporting.
 */
export function ResearchFeature({ research }: { research: ResearchProject }) {
  return (
    <Reveal>
      <Link
        href={`/research/${research.slug}`}
        className="group block border-t border-border py-14 first:border-t-0"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-border bg-accent-soft px-2.5 py-1 font-mono text-[11px] text-accent-foreground">
            <span className="size-1.5 rounded-full bg-accent" />
            {research.status}
          </span>
          {research.publisher ? (
            <span className="font-mono text-xs text-muted-2">
              {research.publisher}
            </span>
          ) : null}
        </div>

        <h3 className="font-display mt-5 max-w-4xl text-[clamp(2rem,5vw,3.75rem)] leading-[0.98] font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent">
          {research.title}
        </h3>
        {research.subtitle ? (
          <p className="mt-2 max-w-2xl text-base text-muted sm:text-lg">
            {research.subtitle}
          </p>
        ) : null}

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
          {research.description}
        </p>

        {research.architecture ? (
          <div className="mt-10">
            <NetworkDiagram architecture={research.architecture} className="sm:p-8" />
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
          {research.metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-1 border-t border-accent-border pt-2">
              <span className="font-mono text-2xl font-medium tabular-nums text-foreground sm:text-3xl">
                {m.value}
              </span>
              <span className="max-w-[10rem] text-xs leading-snug text-muted">
                {m.label}
                {m.context ? (
                  <span className="block text-muted-2">{m.context}</span>
                ) : null}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <TagRow items={research.technologies} />
          <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
            Read case study
            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
