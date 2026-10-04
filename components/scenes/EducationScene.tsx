"use client";

import { motion } from "motion/react";
import { education } from "@/data/education";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Plain, in-flow — reads in a few seconds, doesn't interfere with scroll.
 */
export function EducationScene() {
  return (
    <section id="education" className="relative px-6 py-24 md:px-[6vw] md:py-32">
      <span className="font-mono text-[11px] tracking-[0.18em] text-accent">
        01 / EDUCATION
      </span>

      <div className="mt-12 flex flex-col gap-12 md:gap-14">
        {education.map((item, i) => (
          <Reveal key={item.institution} delay={i * 0.08}>
            <div className="flex flex-col gap-2 border-b border-border pb-10 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <div>
                <h3 className="font-display text-2xl font-bold text-foreground md:text-4xl">
                  {item.institution}
                </h3>
                <p className="mt-2 text-sm text-muted md:text-base">
                  {item.degree}, {item.field}
                </p>
                {item.notes?.length ? (
                  <motion.p className="mt-2 font-mono text-[11px] tracking-[0.08em] text-muted-2 uppercase">
                    {item.notes.join(" · ")}
                  </motion.p>
                ) : null}
              </div>
              <span className="shrink-0 font-mono text-xs tracking-[0.1em] text-muted-2">
                {item.period}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
