import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { GitHubRepoCard } from "@/components/github/GitHubRepoCard";
import { githubSnapshot } from "@/data/generated/github";
import { site } from "@/data/site";

export function GitHubSection() {
  const { repos } = githubSnapshot;
  if (repos.length === 0) return null;

  return (
    <section id="github" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeader
          index="03"
          label="MORE ON GITHUB"
          title="More on GitHub"
          description="Additional research and experiments, curated from public repositories."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo, i) => (
            <GitHubRepoCard key={repo.name} repo={repo} index={i} />
          ))}
        </div>
        <div className="mt-8">
          <ExternalLink href={site.github} className="text-sm">
            View full GitHub profile
          </ExternalLink>
        </div>
      </Container>
    </section>
  );
}
