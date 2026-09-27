"use client";

import { motion, useReducedMotion } from "motion/react";
import { findings } from "@/data/findings";
import { cn } from "@/lib/utils";

/**
 * The one rust-colored scene. Each finding enters from an alternating side
 * like a page torn from a different notebook — huge fragment, tiny note.
 */
export function FindingsScene() {
  const reduce = useReducedMotion();

  return (
    <section
      id="findings"
      className="relative overflow-hidden bg-alert-soft px-6 py-32 md:px-[6vw] md:py-44"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 20%, rgba(180,119,103,0.18), transparent 70%), radial-gradient(40% 40% at 10% 90%, rgba(180,119,103,0.12), transparent 70%)",
        }}
      />
      <div className="relative">
        <span className="font-mono text-[11px] tracking-[0.18em] text-alert">
          03 / SECURITY FINDINGS · FIELD NOTES
        </span>

        <div className="mt-20 flex flex-col gap-28 md:gap-40">
          {findings.map((f, i) => {
            const fromRight = i % 2 === 1;
            return (
              <motion.article
                key={f.id}
                initial={reduce ? false : { opacity: 0, x: fromRight ? 120 : -120 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ type: "spring", stiffness: 60, damping: 18, mass: 1.1 }}
                className={cn(
                  "relative max-w-3xl",
                  fromRight && "md:ml-auto md:text-right",
                )}
              >
                <span className="font-mono text-[11px] text-alert">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <h3 className="font-display mt-2 text-[clamp(3rem,10vw,8.5rem)] leading-[0.85] font-bold tracking-tighter text-foreground">
                  {f.fragment[0]}
                </h3>
                <p className="font-display mt-1 text-[clamp(1.25rem,3.5vw,2.75rem)] leading-none font-bold tracking-tight text-alert uppercase">
                  {f.fragment[1]}
                </p>
                <p
                  className={cn(
                    "mt-6 max-w-md text-sm leading-relaxed text-muted",
                    fromRight && "md:ml-auto",
                  )}
                >
                  {f.description}
                </p>
                <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-muted-2 uppercase">
                  {f.source}
                  {f.year ? ` · ${f.year}` : ""}
                  {f.status ? ` · ${f.status}` : ""}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
