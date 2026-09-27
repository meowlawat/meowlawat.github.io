import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { research } from "@/data/research";
import { Container } from "@/components/ui/Container";
import { BackLink } from "@/components/ui/BackLink";
import { MetricGrid } from "@/components/ui/Metric";
import { TagRow } from "@/components/ui/Tag";
import { DetailSection } from "@/components/ui/DetailSection";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { NetworkDiagram } from "@/components/architecture/NetworkDiagram";

export function generateStaticParams() {
  return research.map((r) => ({ slug: r.slug }));
}

function getResearch(slug: string) {
  return research.find((r) => r.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const paper = getResearch(slug);
  if (!paper) return {};
  return {
    title: paper.title,
    description: paper.description,
    openGraph: { title: paper.title, description: paper.description },
  };
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paper = getResearch(slug);
  if (!paper) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: paper.title,
    description: paper.description,
    ...(paper.publisher ? { publisher: { "@type": "Organization", name: paper.publisher } } : {}),
    datePublished: paper.year,
  };

  return (
    <article className="py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="scroll-progress fixed inset-x-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-accent"
      />
      <Container className="max-w-3xl">
        <script
          type="application/ld+json"
           
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <BackLink label="Back to overview" />

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-border bg-accent-soft px-2.5 py-1 font-mono text-[11px] text-accent-foreground">
            <span className="size-1.5 rounded-full bg-accent" />
            {paper.status}
          </span>
          {paper.publisher ? (
            <span className="font-mono text-xs text-muted-2">
              {paper.publisher}
            </span>
          ) : null}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {paper.title}
        </h1>
        {paper.subtitle ? (
          <p className="mt-2 text-lg text-muted">{paper.subtitle}</p>
        ) : null}

        <p className="mt-6 max-w-2xl text-balance leading-relaxed text-muted">
          {paper.description}
        </p>

        <div className="mt-8">
          <TagRow items={paper.technologies} />
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <MetricGrid metrics={paper.metrics} />
        </div>

        {paper.architecture ? (
          <div className="mt-10">
            <NetworkDiagram architecture={paper.architecture} />
          </div>
        ) : null}

        <div className="mt-4">
          <DetailSection title="Problem">{paper.details.problem}</DetailSection>
          <DetailSection title="Approach">{paper.details.approach}</DetailSection>
          {paper.details.threatModel ? (
            <DetailSection title="Threat Model">
              {paper.details.threatModel}
            </DetailSection>
          ) : null}
          <DetailSection title="Implementation">
            {paper.details.implementation}
          </DetailSection>
          <DetailSection title="Results">{paper.details.results}</DetailSection>
          <DetailSection title="Limitations">
            {paper.details.limitations}
          </DetailSection>
        </div>

        {paper.links.repo || paper.links.paper || paper.links.artifact ? (
          <div className="mt-10 flex flex-wrap gap-6 border-t border-border pt-8">
            {paper.links.repo ? (
              <ExternalLink href={paper.links.repo}>Repository</ExternalLink>
            ) : null}
            {paper.links.paper ? (
              <ExternalLink href={paper.links.paper}>Paper</ExternalLink>
            ) : null}
            {paper.links.artifact ? (
              <ExternalLink href={paper.links.artifact}>Archive</ExternalLink>
            ) : null}
          </div>
        ) : null}
      </Container>
    </article>
  );
}
