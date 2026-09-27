"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { githubSnapshot } from "@/data/generated/github";
import { cn } from "@/lib/utils";

// Deterministic (seeded) layout so server and client render the same field.
function seeded(n: number) {
  let s = 7;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: n }, (_, i) => ({
    x: 6 + r() * 88,
    y: 8 + r() * 84,
    fade: 0.06 + (i / n) * 0.36,
  }));
}
const FIELD = seeded(26);

const LINKS = [
  { href: `mailto:${site.email}`, label: "Email", external: false },
  { href: site.github, label: "GitHub", external: true },
  { href: site.linkedin, label: "LinkedIn", external: true },
  { href: site.orcid, label: "ORCID", external: true },
];

/**
 * The ending. Scroll progress quiets the system: nodes drop out one by one,
 * the atmosphere dims, one sage node remains — then the contact resolves.
 */
export function ContactScene() {
  const ref = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setP(Math.round(v * 50) / 50));

  const resolved = p >= 0.46;
  const repo = githubSnapshot.repos[0];

  return (
    <section id="contact" ref={ref} className="relative h-[240vh]">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-6 md:px-[6vw]">
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: Math.max(0.03, 0.22 - p * 0.45),
            background: "radial-gradient(50% 50% at 50% 50%, var(--accent), transparent 70%)",
          }}
        />
        {FIELD.map((n, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            className={cn(
              "absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-[opacity,scale] duration-700",
              p >= n.fade ? "scale-0 opacity-0" : "opacity-70",
            )}
          />
        ))}

        {/* The one node that stays: the system, idle and waiting. */}
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{ scale: p >= 0.4 ? 1.6 : 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          className="node-pulse absolute top-[26%] right-[14%] size-3 rounded-full bg-verified shadow-[0_0_30px_8px_var(--verified-soft)] md:top-1/2 md:right-[22%]"
        />

        <motion.div
          initial={false}
          animate={{ opacity: resolved ? 1 : 0, y: resolved ? 0 : 40 }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
          className="relative has-[:focus-visible]:!opacity-100"
        >
          <span className="font-mono text-[11px] tracking-[0.18em] text-muted-2">
            05 / SIGNAL · AWAITING CONNECTION
          </span>
          <h2 className="font-display mt-4 text-[clamp(3.25rem,11vw,10rem)] leading-[0.85] font-bold tracking-tighter text-foreground uppercase">
            Let&rsquo;s
            <br />
            <span className="text-accent">connect.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">
            Research, security, systems, or an interesting engineering problem.
          </p>
          <nav aria-label="Contact" className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center gap-1.5 border-b border-accent/30 pb-1 font-mono text-sm tracking-[0.08em] text-foreground uppercase transition-colors hover:border-accent"
              >
                {l.label}
                <ArrowUpRight className="size-4 text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </nav>
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
        </motion.div>
      </div>
    </section>
  );
}
