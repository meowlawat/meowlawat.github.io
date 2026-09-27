import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { MetricGrid } from "@/components/ui/Metric";
import { TagRow } from "@/components/ui/Tag";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { NetworkDiagram } from "@/components/architecture/NetworkDiagram";

export function ProjectFeature({
  project,
  flagship = false,
}: {
  project: Project;
  flagship?: boolean;
}) {
  const titleWords = project.title.split(" ");

  return (
    <Reveal>
      <article className="border-t border-border py-14 first:border-t-0">
        <div className="flex flex-col gap-5 lg:max-w-2xl">
          <span className="font-mono text-xs tracking-[0.14em] text-muted-2">
            {String(1).padStart(2, "0")} / {project.category}
          </span>
          <h3
            className={
              flagship
                ? "font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.95] font-bold tracking-tight text-foreground uppercase"
                : "text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            }
          >
            {flagship
              ? titleWords.map((w, i) => (
                  <span
                    key={i}
                    className={i === 1 ? "block text-accent" : "block"}
                  >
                    {w}
                  </span>
                ))
              : project.title}
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
              Explore system
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
          <div className={flagship ? "mt-10 sm:mt-14" : "mt-10"}>
            <NetworkDiagram
              architecture={project.architecture}
              large={flagship}
              eyebrow={
                flagship
                  ? "TOPOLOGY / TELEMETRY / FAULT / RECOVERY"
                  : undefined
              }
              footnoteLeft={project.stack.slice(0, 3).join(" · ").toUpperCase()}
              footnoteRight={flagship ? "BACKUP PATH ACTIVE" : undefined}
            />
          </div>
        ) : null}
      </article>
    </Reveal>
  );
}
