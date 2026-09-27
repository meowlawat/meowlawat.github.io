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
  reversed = false,
}: {
  project: Project;
  reversed?: boolean;
}) {
  return (
    <Reveal>
      <article className="grid gap-8 border-b border-border py-14 first:pt-0 last:border-b-0 lg:grid-cols-2 lg:gap-12">
        <div
          className={cn(
            "flex flex-col justify-center gap-5",
            reversed && "lg:order-2",
          )}
        >
          <span className="font-mono text-xs tracking-[0.14em] text-muted-2">
            {project.category}
          </span>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
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

        <div
          className={cn(
            "flex items-center",
            reversed && "lg:order-1",
          )}
        >
          {project.architecture ? (
            <ArchitectureDiagram
              architecture={project.architecture}
              className="w-full"
            />
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}
