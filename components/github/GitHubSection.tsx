import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { githubSnapshot } from "@/data/generated/github";
import { site } from "@/data/site";

/**
 * GitHub is supporting evidence, not the work itself — deliberately
 * compact. One line naming the strongest curated repo, one link out.
 */
export function GitHubSection() {
  const featured = githubSnapshot.repos[0];

  return (
    <section id="github" className="border-b border-border py-10">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-[0.14em] text-muted-2">
            <span>GITHUB / OPEN SOURCE</span>
            {featured ? (
              <span className="text-muted">
                {featured.name} — {featured.category}
              </span>
            ) : null}
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground transition-colors hover:text-accent"
            >
              VIEW ALL ON GITHUB →
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
