"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { research } from "@/data/research";
import { projects } from "@/data/projects";
import { SLOW } from "@/lib/motion";
import { useSceneProgress } from "@/lib/scroll";

const HeroTopology = dynamic(
  () => import("@/components/hero/HeroTopology").then((m) => m.HeroTopology),
  { ssr: false },
);

const rise = {
  hidden: { opacity: 0, y: "18%" },
  visible: (i: number) => ({
    opacity: 1,
    y: "0%",
    transition: { ...SLOW, delay: 0.15 + i * 0.12 },
  }),
};

/**
 * Not a document header — an environment. The name is a physical object
 * spanning the viewport; the system field runs behind it and a few nodes
 * and signals cross in front of it. Everything else is edge annotation.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const anim = (i: number) =>
    reduce ? {} : { variants: rise, initial: "hidden", animate: "visible", custom: i };

  // Depth for the topology's parallax, and a matching whisper of drift on
  // the name itself — the midground moves least of all three layers.
  const depth = useSceneProgress(ref, ["start start", "end start"]);
  const nameY = useTransform(depth, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-3%"]);

  return (
    <section id="home" ref={ref} className="relative isolate h-[100svh] min-h-[560px] overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -top-1/3 right-[-20%] z-0 size-[90vw] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-30%] left-[-15%] z-0 size-[60vw] rounded-full opacity-[0.1] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--system) 0%, transparent 65%)" }}
      />
      <HeroTopology depth={depth} />

      {/* Edge annotations — top right. */}
      <motion.div
        {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.9 } })}
        className="absolute top-24 right-6 z-30 max-w-[15rem] text-right md:top-[20%] md:right-[6vw] md:max-w-xs"
      >
        <p className="font-mono text-[10px] tracking-[0.16em] text-accent">
          CYBERSECURITY · MACHINE LEARNING · SYSTEMS
        </p>
        <p className="mt-3 hidden text-sm leading-relaxed text-foreground/75 md:block">
          {site.tagline}
        </p>
        <nav aria-label="Explore" className="mt-5 flex flex-col items-end gap-2">
          {[
            { href: "#research", label: "Explore research" },
            { href: "#projects", label: "Explore systems" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group inline-flex items-center gap-1.5 border-b border-accent/30 pb-0.5 font-mono text-[11px] tracking-[0.12em] text-foreground uppercase transition-colors hover:border-accent"
            >
              {l.label}
              <ArrowUpRight className="size-3.5 text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
        </nav>
      </motion.div>

      {/* The name — the largest object in the scene, bottom-anchored. */}
      <motion.h1
        style={{ y: nameY }}
        className="font-display absolute right-0 bottom-[16%] left-0 z-10 px-[3vw] leading-[0.82] font-bold tracking-tighter text-foreground uppercase md:bottom-[12%]"
      >
        <span className="block overflow-hidden text-[17vw]">
          <motion.span className="block" {...anim(0)}>
            Hardik
          </motion.span>
        </span>
        <span className="block overflow-hidden pl-[11vw] text-[17vw]">
          <motion.span className="block" {...anim(1)}>
            Ahl<span className="text-accent">awat</span>
          </motion.span>
        </span>
      </motion.h1>

      {/* Edge annotations — bottom. */}
      <div className="absolute right-6 bottom-6 left-6 z-30 flex items-end justify-between font-mono text-[10px] tracking-[0.14em] text-muted-2 md:right-[6vw] md:left-[6vw]">
        <span>
          28.61° N 77.21° E
          <br />
          {site.location.toUpperCase()}
        </span>
        <span className="hidden md:block">SCROLL ↓</span>
        <span className="text-right">
          {research.length} RESEARCH · {projects.filter((p) => p.featured).length} SYSTEM
          <br />
          <span className="text-verified">● ACTIVE</span>
        </span>
      </div>
    </section>
  );
}
