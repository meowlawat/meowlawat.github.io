"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { research } from "@/data/research";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { SPRING_SOFT } from "@/lib/motion";

const metering = research.find((r) => r.slug === "token-accounting-integrity-llm-metering")!;
const lstm = research.find((r) => r.slug === "lstm-password-guessing-argon2id")!;
const m = (r: typeof metering, label: string) => r.metrics.find((x) => x.label === label)?.value ?? "";

const LEAK = [
  { key: "controlled", label: "Controlled testbed", value: m(metering, "Value leakage, controlled") },
  { key: "real", label: "Real serving stack", value: m(metering, "Value leakage, real serving stack") },
];

// 40 × 25 = 1,000 dots, each ≈ 0.1% of the credentials evaluated.
const COLS = 40;
const ROWS = 25;
const MATCH_RATE = parseFloat(m(lstm, "Attack match rate")); // 0.87
const LIT = Math.round((MATCH_RATE / 100) * COLS * ROWS); // ≈ 9
const LIT_CELLS = new Set(
  Array.from({ length: LIT }, (_, i) => (i * 113 + 37) % (COLS * ROWS)),
);

function LeakageExperiment() {
  const [which, setWhich] = useState(0);
  const pct = parseFloat(LEAK[which].value);

  return (
    <div>
      <span className="font-mono text-[11px] tracking-[0.16em] text-accent">
        FIELD EXPERIMENT / {metering.year}
      </span>
      <h3 className="font-display mt-3 max-w-md text-2xl leading-tight font-bold text-foreground md:text-3xl">
        {metering.title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
        The server recounts usage correctly — then bills from the
        client-influenced record anyway.
      </p>

      <div role="group" aria-label="Setting" className="mt-6 flex gap-2">
        {LEAK.map((l, i) => (
          <button
            key={l.key}
            type="button"
            aria-pressed={which === i}
            onClick={() => setWhich(i)}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.08em] transition-colors",
              which === i
                ? "border-accent bg-accent-soft text-accent-foreground"
                : "border-border-strong text-muted hover:text-foreground",
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Delivered value vs what was actually billed. */}
      <div className="mt-6 space-y-3">
        <div>
          <span className="font-mono text-[10px] tracking-[0.12em] text-muted-2">VALUE DELIVERED</span>
          <div className="mt-1 h-3 w-full rounded-full bg-accent/70" />
        </div>
        <div>
          <span className="font-mono text-[10px] tracking-[0.12em] text-muted-2">VALUE BILLED</span>
          <div className="relative mt-1 h-3 w-full rounded-full bg-border">
            <motion.div
              className="h-3 rounded-full bg-system"
              animate={{ width: `${100 - pct}%` }}
              transition={SPRING_SOFT}
            />
          </div>
        </div>
      </div>
      <p className="mt-4 font-display text-5xl font-bold text-foreground tabular-nums md:text-6xl">
        <motion.span key={which} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {LEAK[which].value}
        </motion.span>
      </p>
      <p className="font-mono text-[11px] tracking-[0.12em] text-muted">
        OF DELIVERED VALUE NEVER BILLED · {m(metering, "Formal verification")} TLA+ CONFIGURATIONS
      </p>
      <p className="mt-3 font-mono text-[11px] tracking-[0.12em] text-accent">
        {metering.status.toUpperCase()}
      </p>
      <Link
        href={`/research/${metering.slug}`}
        className="group mt-4 inline-flex items-center gap-1.5 text-sm text-foreground"
      >
        Read the note
        <ArrowUpRight className="size-4 text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}

function PasswordExperiment() {
  const [hover, setHover] = useState(false);
  return (
    <div>
      <span className="font-mono text-[11px] tracking-[0.16em] text-accent">
        FIELD EXPERIMENT / {lstm.year}
      </span>
      <h3 className="font-display mt-3 max-w-md text-2xl leading-tight font-bold text-foreground md:text-3xl">
        {lstm.title} <span className="text-accent">{lstm.subtitle}</span>
      </h3>

      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative mt-6 aspect-[40/25] w-full max-w-md"
        role="img"
        aria-label={`Dot field of 1,000 cells; about ${LIT} lit, representing a ${m(lstm, "Attack match rate")} match rate over ${m(lstm, "Credentials evaluated")} credentials.`}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: "radial-gradient(circle, var(--border-strong) 1.2px, transparent 1.4px)",
            backgroundSize: `${100 / COLS}% ${100 / ROWS}%`,
          }}
        />
        {Array.from(LIT_CELLS).map((c) => (
          <motion.span
            key={c}
            className="absolute size-[1.6%] min-h-1 min-w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-verified"
            style={{
              left: `${((c % COLS) + 0.5) * (100 / COLS)}%`,
              top: `${(Math.floor(c / COLS) + 0.5) * (100 / ROWS)}%`,
            }}
            animate={{ scale: hover ? 2.4 : 1 }}
            transition={SPRING_SOFT}
          />
        ))}
      </div>
      <p className="mt-2 font-mono text-[10px] tracking-[0.12em] text-muted-2">
        EACH DOT ≈ 0.1% OF {m(lstm, "Credentials evaluated")} CREDENTIALS · HOVER TO FIND THE MATCHES
      </p>

      <p className="mt-4 font-display text-5xl font-bold text-foreground tabular-nums md:text-6xl">
        {m(lstm, "Attack match rate")}
      </p>
      <p className="font-mono text-[11px] tracking-[0.12em] text-muted">
        MATCHED UNDER ARGON2ID (m=65536, t=3, p=4) · DESPITE A GUESSER{" "}
        {m(lstm, "Efficiency vs. 3-gram Markov baseline")} MORE EFFICIENT THAN 3-GRAM MARKOV
      </p>
      <p className="mt-3 font-mono text-[11px] tracking-[0.12em] text-accent">
        {lstm.status.toUpperCase()} · {lstm.publisher?.toUpperCase()}
      </p>
      <Link
        href={`/research/${lstm.slug}`}
        className="group mt-4 inline-flex items-center gap-1.5 text-sm text-foreground"
      >
        Read the case study
        <ArrowUpRight className="size-4 text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}

export function ResearchExperiments() {
  return (
    <section id="experiments" className="relative px-6 py-28 md:px-[6vw] md:py-40">
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute top-10 right-[4vw] text-[16vw] leading-none font-bold tracking-tighter text-foreground/[0.03] select-none"
      >
        FIELD
      </span>
      <div className="relative grid gap-24 md:grid-cols-2 md:gap-[8vw]">
        <Reveal y={40}>
          <LeakageExperiment />
        </Reveal>
        <Reveal y={40} delay={0.1} className="md:mt-40">
          <PasswordExperiment />
        </Reveal>
      </div>
    </section>
  );
}
