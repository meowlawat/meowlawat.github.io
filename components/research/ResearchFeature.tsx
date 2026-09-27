import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResearchProject } from "@/lib/types";
import { TagRow } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { NetworkDiagram } from "@/components/architecture/NetworkDiagram";

/**
 * The one research entry given hero-like visual weight: a giant year
 * number, venue metadata as loose caption lines, and metrics as a
 * divided instrument readout rather than a boxed grid.
 */
export function ResearchFeature({ research }: { research: ResearchProject }) {
  const titleParts = research.title.split(/(\(.*\))/).filter(Boolean);

  return (
    <Reveal>
      <Link
        href={`/research/${research.slug}`}
        className="group block border-t border-border py-14 first:border-t-0"
      >
        <span className="font-display block text-[clamp(3rem,9vw,5.5rem)] leading-none font-bold text-accent">
          {research.year}
        </span>

        <div className="mt-4 flex flex-col gap-0.5 font-mono text-xs text-muted-2">
          <span>{research.venue}</span>
          {research.publisher ? <span>{research.publisher}</span> : null}
          <span>{research.technologies.join(" / ")}</span>
        </div>

        <h3 className="font-display mt-5 max-w-4xl text-[clamp(1.75rem,4.5vw,3.25rem)] leading-[1.02] font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent">
          {titleParts.map((part, i) =>
            part.startsWith("(") ? (
              <span key={i} className="text-accent">
                {" "}
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </h3>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          {research.description}
        </p>

        <div className="mt-10 grid grid-cols-2 divide-x divide-y divide-border border-t border-l border-border sm:grid-cols-4 sm:divide-y-0">
          {research.metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              <span className="font-mono text-xl font-medium tabular-nums text-foreground sm:text-2xl">
                {m.value}
              </span>
              <span className="text-[11px] leading-snug text-muted uppercase">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {research.architecture ? (
          <div className="mt-10">
            <NetworkDiagram
              architecture={research.architecture}
              large
              eyebrow="TRUSTED DATA PATH / 01"
              footnoteLeft={research.technologies.join(" · ").toUpperCase()}
              footnoteRight="VERIFIED"
            />
          </div>
        ) : null}

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
