"use client";

import dynamic from "next/dynamic";
import { useRef, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";
import { research } from "@/data/research";
import { projects } from "@/data/projects";
import { DRAMATIC } from "@/lib/motion";

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
  { href: "#research", label: "Explore research" },
  { href: "#projects", label: "Explore systems" },
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
      {/* Ambient color field: a large, always-on atmospheric wash anchored
          top-right (where the topology sits), plus a subtler pointer-
          tracked one — real color presence, not a tiny spotlight. */}
      <div
        aria-hidden="true"
        className="absolute -top-1/4 -right-1/4 -z-20 size-[70vw] rounded-full opacity-[0.14] blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 opacity-[0.1] blur-3xl"
        style={{
          background:
            "radial-gradient(600px circle at var(--x, 70%) var(--y, 30%), var(--accent), transparent 70%)",
        }}
      />

      <Container className="flex flex-1 flex-col justify-center">
        <motion.div
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "visible"}
          variants={reduceMotion ? undefined : container}
          className="grid gap-6 lg:grid-cols-12"
        >
          <div className="relative lg:col-span-7">
            <motion.div
              variants={reduceMotion ? undefined : item}
              className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted-2"
            >
              <span className="h-px w-6 bg-border-strong" aria-hidden="true" />
              CYBERSECURITY · MACHINE LEARNING · SYSTEMS
            </motion.div>

            <motion.h1
              variants={reduceMotion ? undefined : item}
              className="font-display -ml-1 text-[clamp(3rem,10vw,9rem)] leading-[0.88] font-bold tracking-tight text-foreground"
            >
              <span className="block">Hardik</span>
              <span className="block">
                Ahl
                <span className="text-accent">awat</span>
              </span>
            </motion.h1>

            <motion.p
              variants={reduceMotion ? undefined : item}
              className="mt-6 max-w-md text-balance leading-relaxed text-accent-foreground/80"
            >
              {site.tagline}
            </motion.p>

            <motion.nav
              variants={reduceMotion ? undefined : item}
              className="mt-6 flex flex-col gap-2"
            >
              {EDITORIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group inline-flex w-fit items-center gap-2 border-b border-transparent pb-0.5 text-sm font-medium text-foreground transition-colors duration-150 hover:border-accent"
                >
                  {link.label}
                  <ArrowUpRight className="size-4 text-accent transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </motion.nav>
          </div>

          {/* Topology occupies the right column deliberately — it's a
              compositional element, not a background pasted behind text. */}
          <div className="relative min-h-[280px] lg:col-span-5">
            <HeroTopology />
          </div>
        </motion.div>

        <motion.div
          variants={reduceMotion ? undefined : item}
          initial={reduceMotion ? undefined : "hidden"}
          animate={reduceMotion ? undefined : "visible"}
          className="mt-16 flex flex-col gap-4 font-mono text-[11px] tracking-[0.14em] text-muted-2 sm:mt-24 sm:flex-row sm:items-end sm:justify-between"
        >
          <span>RESEARCH / EXPERIMENT / MEASURE / BUILD</span>
          <div className="flex flex-col gap-0.5 sm:items-end sm:text-right">
            <span>FIELD / {site.location.split(",")[0].toUpperCase()}</span>
            <span>
              {research.length} RESEARCH · {projects.filter((p) => p.featured).length} SYSTEMS
            </span>
            <span className="flex items-center gap-1.5 text-verified">
              <span className="node-pulse inline-flex size-1.5 rounded-full bg-verified" />
              ACTIVE
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
