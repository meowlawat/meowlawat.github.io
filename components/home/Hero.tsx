"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";
import { experience } from "@/data/experience";
import { MEDIUM } from "@/lib/motion";
import { goTo } from "@/lib/nav";

const current = experience.find((e) => e.current);

const rise = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...MEDIUM, delay: 0.1 + i * 0.08 },
  }),
};

/**
 * Not a visualization — an introduction. Large name, one line of role, one
 * line of what's happening now, quiet background, two restrained links.
 * Who, what, where, currently — read in a few seconds, not a paragraph.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const anim = (i: number) =>
    reduce ? {} : { variants: rise, initial: "hidden", animate: "visible", custom: i };

  return (
    <section id="home" className="relative flex min-h-[92svh] items-center overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 78% 18%, var(--home-accent-soft), transparent 70%)",
        }}
      />

      <Container className="relative py-28">
        <motion.p
          {...anim(0)}
          className="font-mono text-xs tracking-[0.14em] text-muted-2 uppercase"
        >
          {site.location}
        </motion.p>

        <motion.h1
          {...anim(1)}
          className="font-display mt-5 text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.98] font-bold tracking-tight text-foreground"
        >
          {site.name}
        </motion.h1>

        <motion.p
          {...anim(2)}
          className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          Cybersecurity researcher and systems builder working across trusted
          computing, network security and applied machine learning.
        </motion.p>

        {current ? (
          <motion.p {...anim(3)} className="mt-4 max-w-xl text-sm leading-relaxed text-muted-2">
            Currently a {current.role.toLowerCase()} at {current.org}, working on{" "}
            {current.summary.charAt(0).toLowerCase() + current.summary.slice(1).replace(/\.$/, "")}.
          </motion.p>
        ) : null}

        <motion.div {...anim(4)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <button
            type="button"
            onClick={() => goTo("work")}
            className="group inline-flex items-center gap-1.5 text-sm text-foreground transition-colors duration-300 ease-settle hover:text-home-accent"
          >
            View work
            <ArrowUpRight className="size-4 transition-transform duration-300 ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          <button
            type="button"
            onClick={() => goTo("contact")}
            className="group inline-flex items-center gap-1.5 text-sm text-foreground transition-colors duration-300 ease-settle hover:text-home-accent"
          >
            Get in touch
            <ArrowUpRight className="size-4 transition-transform duration-300 ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </motion.div>
      </Container>
    </section>
  );
}
