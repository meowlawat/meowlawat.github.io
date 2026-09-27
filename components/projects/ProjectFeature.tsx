import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { MetricGrid } from "@/components/ui/Metric";
import { TagRow } from "@/components/ui/Tag";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { ArchitectureDiagram } from "@/components/architecture/ArchitectureDiagram";
import { cn } from "@/lib/utils";

export function ProjectFeature({
  project,
  flagship = false,
}: {
  project: Project;
  flagship?: boolean;
}) {
  return (
    <Reveal>
      <article className="border-b border-border py-14 first:pt-0 last:border-b-0">
        <div className="flex flex-col gap-5 lg:max-w-2xl">
          <span className="font-mono text-xs tracking-[0.14em] text-muted-2">
            {flagship ? "FLAGSHIP PROJECT · " : ""}
            {project.category}
          </span>
          <h3
            className={cn(
              "font-semibold tracking-tight text-foreground",
              flagship ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
            )}
          >
            {project.title}
          </h3>
          <p className="text-sm font-medium text-muted sm:text-base">
            {project.tagline}
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            {project.description}
          </p>

          {project.metrics ? <MetricGrid metrics={project.metrics} /> : null}

          <TagRow items={project.stack} />

          <div className="mt-2 flex flex-wrap items-center gap-5">
            <Link
              href={`/projects/${project.slug}`}
              className="group inline-flex items-center gap-1 text-sm font-medium text-foreground"
            >
              View case study
              <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            {project.links.repo ? (
              <ExternalLink href={project.links.repo} className="text-sm">
                Repository
              </ExternalLink>
            ) : null}
          </div>
        </div>

        {project.architecture ? (
          <div className={cn("mt-10", flagship && "sm:mt-14")}>
            {flagship ? (
              <span className="mb-3 block font-mono text-[11px] tracking-[0.14em] text-muted-2">
                SYSTEM TOPOLOGY
              </span>
            ) : null}
            <ArchitectureDiagram
              architecture={project.architecture}
              className={flagship ? "sm:p-8" : undefined}
            />
          </div>
        ) : null}
      </article>
    </Reveal>
  );
}
