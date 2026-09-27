import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResearchProject } from "@/lib/types";
import { MetricGrid } from "@/components/ui/Metric";
import { TagRow } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";

export function ResearchCard({
  research,
  index,
}: {
  research: ResearchProject;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.06}>
      <Link
        href={`/research/${research.slug}`}
        className="group block rounded-xl border border-border bg-surface/40 p-6 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface motion-reduce:hover:translate-y-0 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
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

        <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {research.title}
        </h3>
        {research.subtitle ? (
          <p className="mt-1 text-sm text-muted sm:text-base">
            {research.subtitle}
          </p>
        ) : null}

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          {research.description}
        </p>

        <div className="mt-6">
          <MetricGrid metrics={research.metrics} />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
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
