"use client";

import dynamic from "next/dynamic";
import { useRef, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { GithubIcon, LinkedinIcon, OrcidIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/Container";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { site } from "@/data/site";

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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

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
      className="relative isolate flex min-h-[92svh] items-center overflow-hidden border-b border-border pt-24"
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

      <Container>
        <motion.div
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "visible"}
          variants={reduceMotion ? undefined : container}
          className="flex max-w-3xl flex-col gap-6"
        >
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
            className="text-[clamp(2.25rem,4vw+1rem,4.5rem)] leading-[1.05] font-semibold tracking-tight text-foreground"
          >
            {site.name}
          </motion.h1>

          <motion.p
            variants={reduceMotion ? undefined : item}
            className="text-lg font-medium text-balance text-foreground/90 sm:text-xl"
          >
            {site.positioning}
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
        </motion.div>
      </Container>
    </section>
  );
}
