import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResearchProject } from "@/lib/types";
import { MetricGrid } from "@/components/ui/Metric";
import { TagRow } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";
import { NetworkDiagram } from "@/components/architecture/NetworkDiagram";

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
        className="group grid gap-6 border-t border-border py-10 transition-colors duration-200 first:border-t-0 lg:grid-cols-12"
      >
        <div className="flex flex-row items-start gap-4 lg:col-span-3 lg:flex-col lg:gap-3">
          <span className="font-mono text-3xl text-muted-2 transition-colors duration-200 group-hover:text-accent">
            {research.year}
          </span>
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent-border bg-accent-soft px-2.5 py-1 font-mono text-[11px] text-accent-foreground">
              <span className="size-1.5 rounded-full bg-accent" />
              {research.status}
            </span>
            {research.publisher ? (
              <span className="font-mono text-xs text-muted-2">
                {research.publisher}
              </span>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-9">
          <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent sm:text-2xl">
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

          {research.architecture ? (
            <div className="mt-6">
              <NetworkDiagram
                architecture={research.architecture}
                footnoteLeft={research.technologies.join(" · ").toUpperCase()}
              />
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <TagRow items={research.technologies} />
            <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
              Read case study
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
