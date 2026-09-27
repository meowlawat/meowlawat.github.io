import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { Container } from "@/components/ui/Container";
import { BackLink } from "@/components/ui/BackLink";
import { MetricGrid } from "@/components/ui/Metric";
import { TagRow } from "@/components/ui/Tag";
import { DetailSection } from "@/components/ui/DetailSection";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ArchitectureDiagram } from "@/components/architecture/ArchitectureDiagram";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    programmingLanguage: project.stack,
    ...(project.links.repo ? { codeRepository: project.links.repo } : {}),
  };

  return (
    <article className="py-16 sm:py-20">
      <Container className="max-w-3xl">
        <script
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <BackLink label="Back to overview" />

        <span className="mt-8 block font-mono text-xs tracking-[0.14em] text-muted-2">
          {project.category}
        </span>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-2 text-lg text-muted">{project.tagline}</p>

        <p className="mt-6 max-w-2xl text-balance leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="mt-8">
          <TagRow items={project.stack} />
        </div>

        {project.metrics ? (
          <div className="mt-10 border-t border-border pt-8">
            <MetricGrid metrics={project.metrics} />
          </div>
        ) : null}

        {project.architecture ? (
          <div className="mt-10">
            <ArchitectureDiagram architecture={project.architecture} />
          </div>
        ) : null}

        <div className="mt-4">
          <DetailSection title="Overview">
            {project.details.overview}
          </DetailSection>
          {project.details.architectureNote ? (
            <DetailSection title="Architecture">
              {project.details.architectureNote}
            </DetailSection>
          ) : null}
          <DetailSection title="Implementation">
            {project.details.implementation}
          </DetailSection>
          {project.details.results ? (
            <DetailSection title="Results">
              {project.details.results}
            </DetailSection>
          ) : null}
          {project.details.challenges ? (
            <DetailSection title="Challenges">
              {project.details.challenges}
            </DetailSection>
          ) : null}
        </div>

        {project.links.repo || project.links.demo ? (
          <div className="mt-10 flex flex-wrap gap-6 border-t border-border pt-8">
            {project.links.repo ? (
              <ExternalLink href={project.links.repo}>Repository</ExternalLink>
            ) : null}
            {project.links.demo ? (
              <ExternalLink href={project.links.demo}>Demo</ExternalLink>
            ) : null}
          </div>
        ) : null}
      </Container>
    </article>
  );
}
