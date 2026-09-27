/**
 * Build-time GitHub snapshot generator.
 *
 * Queries the GitHub REST API for the curated list of repositories below and
 * writes a typed, generated data file consumed by the site. The visitor's
 * browser never talks to GitHub — this only runs at build time (or on demand
 * via `npm run fetch:github`).
 *
 * Failure behavior: if the GitHub API is unreachable or rate-limited, the
 * previously committed snapshot in data/generated/github.ts is left
 * untouched so the build never breaks. If no snapshot exists yet (first
 * run, no network), a hardcoded fallback snapshot is written instead.
 */
import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const GITHUB_USER = "meowlawat";
const OUTPUT_PATH = resolve(process.cwd(), "data/generated/github.ts");

// Curated allowlist — repos already featured as full case studies
// (mpls-copilot, Deep-NIDS) are intentionally excluded here to avoid
// duplicating them in the "More on GitHub" section.
const CURATED_REPOS = [
  "AetherGraph",
  "Deep-Learning-for-Targeted-Threat-Mitigation",
  "AuthPrint",
] as const;

// Manual description overrides for repos whose GitHub description is thin
// or empty, sourced from the repository's own README — never invented.
const DESCRIPTION_OVERRIDES: Record<string, string> = {
  AuthPrint:
    "Identity-based moderation engine: flags AI-generated submissions by fingerprinting a creator's stylometric writing habits (character n-gram TF-IDF, stylistic drift) instead of analyzing text content.",
};

interface RawRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
  fork: boolean;
}

interface GeneratedRepo {
  name: string;
  description: string;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
}

// Hardcoded fallback, verified against the live API on 2026-09-27. Only
// used if there is no committed snapshot yet AND the live fetch fails.
const FALLBACK_REPOS: GeneratedRepo[] = [
  {
    name: "AetherGraph",
    description:
      "Confidence-aware security-evidence graph fusion: a forensic failure analysis and correction of cross-layer attack-path scoring.",
    url: "https://github.com/meowlawat/AetherGraph",
    language: "Python",
    stars: 0,
    forks: 0,
    updatedAt: "2026-09-11",
    topics: [],
  },
  {
    name: "Deep-Learning-for-Targeted-Threat-Mitigation",
    description:
      "An advanced cybersecurity project that detects spear-phishing emails using a hyperparameter-tuned LSTM classifier.",
    url: "https://github.com/meowlawat/Deep-Learning-for-Targeted-Threat-Mitigation",
    language: "Python",
    stars: 1,
    forks: 0,
    updatedAt: "2026-09-07",
    topics: [],
  },
  {
    name: "AuthPrint",
    description: DESCRIPTION_OVERRIDES.AuthPrint,
    url: "https://github.com/meowlawat/AuthPrint",
    language: "Python",
    stars: 1,
    forks: 0,
    updatedAt: "2026-05-12",
    topics: [],
  },
];

function fileContents(repos: GeneratedRepo[], source: "live" | "fallback") {
  return `// GENERATED FILE — DO NOT EDIT MANUALLY
// Produced by scripts/fetch-github.ts. Run \`npm run fetch:github\` to refresh.
import type { GitHubSnapshot } from "@/lib/types";

export const githubSnapshot = ${JSON.stringify(
    { generatedAt: new Date().toISOString(), source, repos },
    null,
    2,
  )} satisfies GitHubSnapshot;
`;
}

async function fetchLive(): Promise<GeneratedRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
    { headers: { Accept: "application/vnd.github+json" } },
  );
  if (!res.ok) {
    throw new Error(`GitHub API responded ${res.status}`);
  }
  const all = (await res.json()) as RawRepo[];
  const byName = new Map(all.map((r) => [r.name, r]));

  const curated: GeneratedRepo[] = [];
  for (const name of CURATED_REPOS) {
    const r = byName.get(name);
    if (!r) continue; // repo renamed/removed — drop silently, never invent
    curated.push({
      name: r.name,
      description: DESCRIPTION_OVERRIDES[r.name] ?? r.description ?? "",
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.updated_at.slice(0, 10),
      topics: r.topics ?? [],
    });
  }
  return curated;
}

async function main() {
  try {
    const repos = await fetchLive();
    writeFileSync(OUTPUT_PATH, fileContents(repos, "live"));
    console.log(`[fetch-github] wrote live snapshot (${repos.length} repos)`);
  } catch (err) {
    if (existsSync(OUTPUT_PATH)) {
      console.warn(
        `[fetch-github] GitHub fetch failed (${(err as Error).message}); keeping existing snapshot.`,
      );
      return;
    }
    console.warn(
      `[fetch-github] GitHub fetch failed (${(err as Error).message}); writing hardcoded fallback.`,
    );
    writeFileSync(OUTPUT_PATH, fileContents(FALLBACK_REPOS, "fallback"));
  }
}

main();
