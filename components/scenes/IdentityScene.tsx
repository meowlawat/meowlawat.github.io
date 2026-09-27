"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { skills } from "@/data/skills";
import { education } from "@/data/education";
import { achievements } from "@/data/achievements";
import { research } from "@/data/research";
import { cn } from "@/lib/utils";

const group = (name: string) => skills.find((g) => g.category === name)?.items ?? [];

const WORDS = [
  {
    key: "security",
    lines: ["Security"],
    offset: "md:ml-0",
    facts: [
      ...group("Security & Systems"),
      `${achievements[0].title} · ${achievements[0].org} ${achievements[0].year}`,
    ],
  },
  {
    key: "systems",
    lines: ["Systems"],
    offset: "md:ml-[30vw]",
    facts: group("Engineering"),
  },
  {
    key: "ml",
    lines: ["Machine", "Learning"],
    offset: "md:ml-[8vw]",
    facts: group("AI / ML / Data"),
  },
  {
    key: "research",
    lines: ["Research"],
    offset: "md:ml-[38vw]",
    facts: [
      `${research.length} research entries`,
      ...education.flatMap((e) => [
        `${e.institution} — ${e.degree}, ${e.field} (${e.period})`,
        ...(e.notes ?? []),
      ]),
    ],
  },
];

export function IdentityScene() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="about" className="relative overflow-hidden px-6 py-32 md:px-[6vw] md:py-44">
      <span className="font-mono text-[11px] tracking-[0.18em] text-accent">
        04 / IDENTITY
      </span>

      <div className="mt-16 flex flex-col gap-16 md:gap-20">
        {WORDS.map((w) => {
          const dim = active !== null && active !== w.key;
          return (
            <div key={w.key} className={cn("relative", w.offset)}>
              <button
                type="button"
                aria-expanded={active === w.key}
                onMouseEnter={() => setActive(w.key)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(w.key)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === w.key ? null : w.key)}
                className="text-left"
              >
                <motion.span
                  animate={{ opacity: dim ? 0.18 : 1, x: active === w.key ? 12 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                  className={cn(
                    "font-display block text-[clamp(2.75rem,8vw,7rem)] leading-[0.88] font-bold tracking-tighter uppercase transition-colors duration-300",
                    active === w.key ? "text-accent" : "text-foreground",
                  )}
                >
                  {w.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </motion.span>
              </button>
              <motion.ul
                animate={{ opacity: dim ? 0.12 : active === w.key ? 1 : 0.55 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex max-w-xl flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-[0.06em] text-muted"
              >
                {w.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </motion.ul>
            </div>
          );
        })}
      </div>

      <p className="mt-24 font-mono text-[10px] tracking-[0.12em] text-muted-2 uppercase">
        Also — {achievements.slice(1).map((a) => a.title).join(" · ")}
      </p>
    </section>
  );
}
