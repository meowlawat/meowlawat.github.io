"use client";

import dynamic from "next/dynamic";
import { useRef, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, OrcidIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";
import { DRAMATIC, SECTION } from "@/lib/motion";

const HeroTopology = dynamic(
  () => import("@/components/hero/HeroTopology").then((m) => m.HeroTopology),
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

const EDITORIAL_LINKS = [
  { href: "#research", index: "01", label: "Research" },
  { href: "#projects", index: "02", label: "Systems" },
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
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden border-b border-border pt-20"
    >
      {/* Ambient blue field: a large, always-on atmospheric wash anchored
          top-right, plus a pointer-tracked one — real color presence, not
          a tiny spotlight. */}
      <div
        aria-hidden="true"
        className="absolute -top-1/4 -right-1/4 -z-20 size-[70vw] rounded-full opacity-[0.16] blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 opacity-[0.12] blur-3xl"
        style={{
          background:
            "radial-gradient(600px circle at var(--x, 50%) var(--y, 30%), var(--accent), transparent 70%)",
        }}
      />
      <HeroTopology />

      <Container className="flex flex-1 flex-col justify-center">
        <motion.div
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "visible"}
          variants={reduceMotion ? undefined : container}
          className="flex flex-col gap-8"
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
            className="font-display -ml-1 text-[clamp(3.5rem,15vw,13rem)] leading-[0.82] font-semibold tracking-tighter text-foreground uppercase"
          >
            <span className="block">Hardik</span>
            <span className="block text-transparent [-webkit-text-stroke:1.5px_var(--foreground)]">
              Ahlawat
            </span>
          </motion.h1>

          <motion.div
            variants={reduceMotion ? undefined : item}
            className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <p className="max-w-md text-balance leading-relaxed text-muted">
              <span className="font-mono text-xs tracking-[0.14em] text-muted-2">
                RESEARCH. EXPERIMENT. MEASURE. BUILD.
              </span>
              <br />
              <span className="text-foreground/80">{site.tagline}</span>
            </p>

            <nav className="flex flex-col gap-1">
              {EDITORIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 font-mono text-sm text-muted transition-colors duration-150 hover:text-foreground"
                >
                  <span className="text-muted-2">{link.index}</span>
                  <span className="uppercase tracking-wide">{link.label}</span>
                  <ArrowUpRight className="size-4 text-accent transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      </Container>

      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={reduceMotion ? undefined : { opacity: 1 }}
        transition={{ ...SECTION, delay: 0.7 }}
        className="relative z-10 border-t border-border"
      >
        <Container className="flex h-14 items-center justify-between font-mono text-[11px] tracking-[0.1em] text-muted-2">
          <span className="flex items-center gap-1.5 text-verified">
            <span className="relative flex size-1.5">
              <span className="node-pulse absolute inline-flex size-full rounded-full bg-verified opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-verified" />
            </span>
            SYSTEM ONLINE
          </span>
          <div className="flex items-center gap-4 text-muted">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-[15px]" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-foreground"
            >
              <LinkedinIcon className="size-[15px]" />
            </a>
            <a
              href={site.orcid}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ORCID"
              className="transition-colors hover:text-foreground"
            >
              <OrcidIcon className="size-[15px] rounded-full" />
            </a>
          </div>
          <span>01 / 10</span>
        </Container>
      </motion.div>
    </section>
  );
}
