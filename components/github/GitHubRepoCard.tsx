import { Star, GitFork } from "lucide-react";
import type { GeneratedRepo } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

export function GitHubRepoCard({
  repo,
  index,
}: {
  repo: GeneratedRepo;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.05}>
      <a
        href={repo.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col justify-between gap-4 rounded-xl border border-border bg-surface/40 p-6 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface motion-reduce:hover:translate-y-0"
      >
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-mono text-sm font-medium text-foreground transition-colors duration-150 group-hover:text-accent">
              {repo.name}
            </h3>
          </div>
          <span className="mt-1 block text-[11px] tracking-wide text-muted-2 uppercase">
            {repo.category}
          </span>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {repo.description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-2">
          <span className="font-mono">{repo.language ?? "—"}</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5" /> {repo.stars}
            </span>
            <span className="inline-flex items-center gap-1">
              <GitFork className="size-3.5" /> {repo.forks}
            </span>
          </div>
        </div>
      </a>
    </Reveal>
  );
}
