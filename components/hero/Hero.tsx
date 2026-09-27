"use client";

import dynamic from "next/dynamic";
import { useRef, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GithubIcon, LinkedinIcon, OrcidIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { site } from "@/data/site";
import { research } from "@/data/research";
import { projects } from "@/data/projects";
import { githubSnapshot } from "@/data/generated/github";
import { DRAMATIC, SECTION } from "@/lib/motion";

const HeroCanvas = dynamic(
  () => import("@/components/hero/HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: DRAMATIC },
};

// Real, data-derived — never hardcoded copy pretending to be a stat.
const METADATA = [
  { label: "Research", value: String(research.length).padStart(2, "0") },
  { label: "Featured systems", value: String(projects.length).padStart(2, "0") },
  {
    label: "GitHub, curated",
    value: String(githubSnapshot.repos.length).padStart(2, "0"),
  },
  { label: "Based in", value: site.location.split(",")[0] },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const spotlightRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const el = spotlightRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  return (
    <section
      id="home"
      ref={spotlightRef}
      onPointerMove={handlePointerMove}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden border-b border-border pt-24"
      style={{
        backgroundImage:
          "radial-gradient(500px circle at var(--x, 50%) var(--y, 20%), rgba(91,141,239,0.07), transparent 65%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]"
      />
      <HeroCanvas />

      <Container className="flex flex-1 flex-col justify-center">
        <motion.div
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "visible"}
          variants={reduceMotion ? undefined : container}
          className="grid gap-10 lg:grid-cols-12 lg:items-end"
        >
          <div className="flex flex-col gap-6 lg:col-span-8">
            <motion.div
              variants={reduceMotion ? undefined : item}
              className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted-2"
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              SYSTEMS / SECURITY / ML
            </motion.div>

            <motion.h1
              variants={reduceMotion ? undefined : item}
              className="text-[clamp(2.5rem,5vw+1rem,5.25rem)] leading-[0.98] font-semibold tracking-tight text-foreground"
            >
              {site.name}
            </motion.h1>

            <motion.p
              variants={reduceMotion ? undefined : item}
              className="font-mono text-xs tracking-[0.14em] text-muted sm:text-sm"
            >
              RESEARCH. EXPERIMENT. MEASURE. BUILD.
            </motion.p>

            <motion.p
              variants={reduceMotion ? undefined : item}
              className="max-w-lg text-balance leading-relaxed text-muted"
            >
              {site.tagline}
            </motion.p>

            <motion.div
              variants={reduceMotion ? undefined : item}
              className="mt-2 flex flex-wrap items-center gap-3"
            >
              <MagneticButton href="#research" variant="primary">
                View Research
              </MagneticButton>
              <MagneticButton href="#projects" variant="secondary">
                View Projects
              </MagneticButton>
            </motion.div>

            <motion.div
              variants={reduceMotion ? undefined : item}
              className="mt-4 flex items-center gap-5 text-muted"
            >
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="transition-colors hover:text-foreground"
              >
                <GithubIcon className="size-[18px]" />
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-colors hover:text-foreground"
              >
                <LinkedinIcon className="size-[18px]" />
              </a>
              <a
                href={site.orcid}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ORCID"
                className="transition-colors hover:text-foreground"
              >
                <OrcidIcon className="size-[18px] rounded-full" />
              </a>
            </motion.div>
          </div>

          <motion.div
            variants={reduceMotion ? undefined : item}
            className="flex flex-col gap-4 border-t border-border pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
          >
            {METADATA.map((m) => (
              <div key={m.label} className="flex items-baseline justify-between gap-4">
                <span className="text-xs text-muted-2">{m.label}</span>
                <span className="font-mono text-sm text-foreground">
                  {m.value}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>

      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={reduceMotion ? undefined : { opacity: 1 }}
        transition={{ ...SECTION, delay: 0.6 }}
        className="relative z-10 border-t border-border"
      >
        <Container className="flex h-12 items-center justify-between font-mono text-[11px] tracking-[0.1em] text-muted-2">
          <span>SCROLL</span>
          <span>01 / 09</span>
        </Container>
      </motion.div>
    </section>
  );
}
