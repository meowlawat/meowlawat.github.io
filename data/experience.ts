import type { ExperienceItem } from "@/lib/types";

export const experience: ExperienceItem[] = [
  {
    role: "Cybersecurity Analyst",
    org: "Peace Code",
    location: "New Delhi — Hybrid",
    period: "Jun 2026 – Present",
    current: true,
    summary:
      "Vulnerability assessment and risk prioritization for client systems.",
    bullets: [
      "Vulnerability assessments",
      "CVSS-based risk prioritization",
      "Remediation sequencing",
      "Threat intelligence",
      "Security architecture",
    ],
  },
  {
    role: "Security Researcher",
    org: "IdeaPulley Bug Hunt",
    location: "Remote",
    period: "Jun 2026",
    summary:
      "Independent security research identifying authorization and business-logic flaws in a production API.",
    bullets: [
      "Critical API race condition",
      "Rate-limit bypass",
      "Credit-deduction logic bypass",
      "Authorization bypass",
      "Parameter tampering",
      "Clerk auth-metadata manipulation",
    ],
  },
];
