// Shared content types. These are the contract between data/*.ts (manual,
// verified content) and data/generated/*.ts (build-time generated content)
// and the components that render them.

export interface Metric {
  label: string;
  value: string;
  context?: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  description?: string;
  /** Signal Lab color semantics: "signal" (blue, default) or "verified" (lime, trusted/validated step). Never "alert" here — orange stays reserved for the Security Findings section. */
  state?: "signal" | "verified";
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Architecture {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface ResearchDetails {
  problem: string;
  approach: string;
  threatModel?: string;
  implementation: string;
  results: string;
  limitations: string;
}

export interface ResearchProject {
  slug: string;
  title: string;
  subtitle?: string;
  status: string;
  venue: string;
  publisher?: string;
  year: string;
  description: string;
  technologies: string[];
  metrics: Metric[];
  architecture?: Architecture;
  details: ResearchDetails;
  links: {
    repo?: string;
    paper?: string;
    /** Non-code, non-paper archival record (e.g. a Zenodo DOI) for work with no public repo. */
    artifact?: string;
  };
}

export interface ProjectDetails {
  overview: string;
  architectureNote?: string;
  implementation: string;
  results?: string;
  challenges?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  stack: string[];
  metrics?: Metric[];
  architecture?: Architecture;
  featured: boolean;
  details: ProjectDetails;
  links: {
    repo?: string;
    demo?: string;
  };
}

export interface ExperienceItem {
  role: string;
  org: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  bullets: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  period: string;
  notes?: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Achievement {
  title: string;
  org?: string;
  year?: string;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  /** Where this was found/documented — never invented, always traceable to real source material. */
  source: string;
  year?: string;
  /** Present only when the finding is unpublished/unreviewed independent work — rendered plainly, same weight as the rest. */
  status?: string;
}

export interface GeneratedRepo {
  name: string;
  description: string;
  category: string;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
}

export interface GitHubSnapshot {
  generatedAt: string;
  source: "live" | "fallback";
  repos: GeneratedRepo[];
}

export interface SiteConfig {
  name: string;
  role: string;
  positioning: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  githubHandle: string;
  linkedin: string;
  orcid: string;
}
