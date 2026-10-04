"use client";

import { useRef } from "react";
import type React from "react";
import { motion, useReducedMotion } from "motion/react";
import { experience } from "@/data/experience";
import { cn } from "@/lib/utils";
import { MEDIUM } from "@/lib/motion";
import { useSceneProgress } from "@/lib/scroll";

/**
 * Experience as a signal path: the line is drawn by scroll position (not a
 * one-shot reveal), so it grows as you read and retracts if you scroll back.
 */
export function ExperienceScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const scaleY = useSceneProgress(ref, ["start 70%", "end 60%"]);

  return (
    <section
      id="experience"
      ref={ref}
      className="relative px-6 py-28 md:px-[6vw] md:py-36"
    >
      <span className="font-mono text-[11px] tracking-[0.18em] text-system">
        SIGNAL PATH / EXPERIENCE
      </span>

      <div className="relative mt-16 md:ml-[20vw]">
        <div className="absolute top-0 bottom-0 left-[5px] w-px bg-border" aria-hidden="true" />
        <motion.div
          aria-hidden="true"
          style={{ "--sy": reduce ? 1 : scaleY } as unknown as React.CSSProperties}
          className="absolute top-0 bottom-0 left-[5px] w-px origin-top scale-y-[var(--sy)] bg-system"
        />

        <ol className="flex flex-col gap-20">
          {experience.map((item, i) => (
            <motion.li
              key={item.org}
              initial={reduce ? false : { opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ ...MEDIUM, delay: i * 0.05 }}
              className="relative pl-10"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-3 left-0 size-[11px] rounded-full",
                  item.current ? "node-pulse bg-verified" : "bg-system",
                )}
              />
              <span className="font-mono text-[11px] tracking-[0.12em] text-muted-2">
                {item.period.toUpperCase()}
                {item.current ? <span className="ml-3 text-verified">LIVE</span> : null}
              </span>
              <h3 className="font-display mt-1 text-4xl leading-none font-bold tracking-tight text-foreground md:text-6xl">
                {item.org}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {item.role} · {item.location}
              </p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-foreground/80">
                {item.summary}
              </p>
              <p className="mt-3 max-w-xl font-mono text-[11px] leading-relaxed tracking-[0.04em] text-muted">
                {item.bullets.join("  /  ")}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
