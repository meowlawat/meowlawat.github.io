"use client";

import { motion } from "motion/react";
import { site } from "@/data/site";
import { githubSnapshot } from "@/data/generated/github";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const LINKS = [
  { href: `mailto:${site.email}`, label: "Email", external: false, variant: "filled" as const },
  { href: site.github, label: "GitHub", external: true, variant: "outline" as const },
  { href: site.linkedin, label: "LinkedIn", external: true, variant: "outline" as const },
  { href: site.orcid, label: "ORCID", external: true, variant: "outline" as const },
];

/**
 * A normal, always-visible section — not a scroll-gated scene. Reachable
 * in one click from the nav, fully usable the instant you arrive.
 */
export function ContactScene() {
  const repo = githubSnapshot.repos[0];

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 md:px-[6vw] md:py-36">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{ background: "radial-gradient(45% 45% at 80% 20%, var(--accent), transparent 70%)" }}
      />

      <Reveal className="relative">
        <span className="font-mono text-[11px] tracking-[0.18em] text-muted-2">
          05 / SIGNAL · AWAITING CONNECTION
        </span>
        <h2 className="font-display mt-4 text-[clamp(3rem,10vw,9rem)] leading-[0.85] font-bold tracking-tighter text-foreground uppercase">
          Let&rsquo;s
          <br />
          <span className="text-accent">connect.</span>
        </h2>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
          Research, security, systems, or an interesting engineering problem.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {LINKS.map((l) => (
            <LinkButton key={l.label} href={l.href} external={l.external} variant={l.variant}>
              {l.label}
            </LinkButton>
          ))}
        </div>

        {repo ? (
          <p className="mt-10 font-mono text-[11px] tracking-[0.12em] text-muted-2 uppercase">
            Open source ·{" "}
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground"
            >
              {repo.name}
            </a>{" "}
            + selected work ·{" "}
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground"
            >
              view source ↗
            </a>
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
