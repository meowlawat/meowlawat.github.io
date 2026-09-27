"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SceneGraph, type SceneNode, type SceneLink } from "@/components/scenes/SceneGraph";
import { research } from "@/data/research";
import { cn } from "@/lib/utils";

const rds = research.find((r) => r.slug === "runtime-data-shadowing")!;
const metric = (label: string) => rds.metrics.find((m) => m.label === label);

// Each stage is a sentence from the paper's own approach / threat model —
// the scroll position chooses which one is true right now.
const STAGES = [
  "Patient records stay encrypted with AES-128-GCM outside the trusted boundary.",
  "Encrypted data enters an Intel SGX enclave. The host OS and hypervisor are treated as untrusted.",
  "Inside the enclave the data is decrypted and access-control logic runs in protected memory.",
  "A role-aware shadow view of the record is derived for the requesting party.",
  "Only the authorized result is re-encrypted and allowed to leave the boundary.",
];

const NOTES: Record<string, string> = {
  client: "Requests a record for a specific role.",
  encrypted: "Stored and moved only as AES-128-GCM ciphertext.",
  enclave: "Intel SGX — the only place plaintext exists.",
  shadow: "Role-aware view: each requester sees only what their role permits.",
  result: "Re-encrypted before it crosses back out of the enclave.",
};

// Desktop: a horizontal path across the stage. Mobile: a vertical path.
const D_X = [10, 30, 50, 70, 90];
const M_Y = [16, 33, 50, 67, 84];

export function RDSScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const t = useTransform(scrollYProgress, [0.1, 0.82], [0, 4], { clamp: true });
  const packetOpacity = useTransform(scrollYProgress, [0.06, 0.12, 0.72, 0.77], [0, 1, 1, 0]);

  const pdx = useTransform(t, [0, 1, 2, 3, 4], D_X);
  const pmy = useTransform(t, [0, 1, 2, 3, 4], M_Y);

  // Stage comes straight from scroll progress — reading the derived `t`
  // here would return its previous value on a single jump (anchor clicks).
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const v = Math.min(4, Math.max(0, ((p - 0.1) / 0.72) * 4));
    setStage(p < 0.08 ? -1 : Math.min(4, Math.floor(v + 0.35)));
  });

  const ids = ["client", "encrypted", "enclave", "shadow", "result"];
  const nodes: SceneNode[] = rds.architecture!.nodes.map((n, i) => {
    const reached = stage >= i;
    const trusted = n.state === "verified";
    return {
      id: ids[i],
      label: n.label,
      d: [D_X[i], 52],
      m: [22, M_Y[i]],
      size: trusted ? 30 : 18,
      state: !reached ? "idle" : trusted ? "verified" : "active",
      note: NOTES[ids[i]],
      tag:
        i === 2 && stage >= 2
          ? `${metric("Overhead")?.value} overhead`
          : i === 4 && stage >= 4
            ? `${metric("Throughput")?.value} ops/sec`
            : undefined,
    };
  });

  const links: SceneLink[] = ids.slice(0, -1).map((id, i) => ({
    from: id,
    to: ids[i + 1],
    state: stage > i ? (i >= 1 && i <= 2 ? "verified" : "signal") : "idle",
  }));

  const epc = metric("Latency degradation");

  return (
    <section id="research" ref={ref} className="relative h-[430vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Background word — the scene's subject, at scale. */}
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -bottom-[6vw] -left-[2vw] text-[34vw] leading-none font-bold tracking-tighter text-foreground/[0.035] select-none"
        >
          TEE
        </span>

        {/* Trusted boundary: appears once data crosses into the enclave. */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: stage >= 1 ? 1 : 0, scale: stage >= 1 ? 1 : 0.8 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="absolute top-[36%] left-[40%] hidden h-[27%] w-[38%] rounded-[3rem] border border-dashed border-verified-border lg:block"
        >
          <span className="absolute -top-6 left-6 font-mono text-[10px] tracking-[0.14em] text-verified">
            TRUSTED BOUNDARY / SGX
          </span>
        </motion.div>

        {/* EPC threshold ring: the scalability wall, as a physical limit. */}
        <motion.div
          aria-hidden="true"
          animate={{ opacity: stage >= 2 ? 1 : 0, scale: stage >= 2 ? 1 : 0.6 }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          className="absolute top-[49%] left-[50%] hidden size-[26vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-border lg:block"
        >
          <span className="absolute -right-2 bottom-0 translate-x-full font-mono text-[10px] leading-relaxed tracking-[0.1em] text-accent-foreground">
            128 MB EPC
            <br />
            <span className="text-accent">{epc?.value} beyond it</span>
          </span>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: stage < 0 ? 0.35 : 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-x-6 top-[12%] bottom-[32%] lg:inset-x-[6vw] lg:top-[16%] lg:bottom-[20%]"
        >
          <SceneGraph nodes={nodes} links={links} />

          {/* The signal itself — carries the latency metric with it. */}
          <motion.div
            aria-hidden="true"
            style={
              {
                "--pdx": pdx,
                "--pmy": pmy,
                "--po": packetOpacity,
              } as unknown as CSSProperties
            }
            className="pointer-events-none absolute top-[calc(var(--pmy)*1%)] left-[22%] z-20 opacity-[var(--po)] lg:top-[52%] lg:left-[calc(var(--pdx)*1%)]"
          >
            <span className="block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_24px_6px_var(--accent-soft)]" />
            <span className="absolute -top-2 right-4 text-right font-mono text-[11px] whitespace-nowrap text-accent-foreground lg:top-auto lg:right-auto lg:bottom-4 lg:left-1/2 lg:-translate-x-1/2 lg:text-left">
              {metric("Mean query latency")?.value}
              <br className="lg:hidden" /> / query
            </span>
          </motion.div>
        </motion.div>

        {/* Intro: what you're about to watch. Fades as the signal starts. */}
        <motion.div
          initial={false}
          animate={{ opacity: stage < 0 ? 1 : 0, y: stage < 0 ? 0 : -24 }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          className="pointer-events-none absolute bottom-8 left-6 max-w-sm lg:top-[14%] lg:bottom-auto lg:left-[6vw]"
        >
          <span className="font-mono text-[11px] tracking-[0.18em] text-accent">
            01 / RESEARCH
          </span>
          <p className="font-display mt-3 text-3xl leading-tight font-bold text-foreground lg:text-5xl">
            Follow one
            <br />
            <span className="text-accent">medical record.</span>
          </p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.12em] text-muted-2">
            SCROLL TO MOVE IT THROUGH THE SYSTEM ↓
          </p>
        </motion.div>

        {/* Live caption: the sentence that is true at this stage. */}
        <div className={cn("absolute right-6 bottom-8 left-6 transition-opacity duration-500 lg:right-auto lg:bottom-[9%] lg:left-[6vw] lg:max-w-md", stage >= 4 && "max-lg:opacity-0")}>
          <span className={cn("font-mono text-[10px] tracking-[0.14em] text-muted-2 transition-opacity", stage < 0 && "opacity-0")}>
            STATE {String(Math.max(stage, 0) + 1).padStart(2, "0")} / 05
          </span>
          <p
            key={stage}
            aria-hidden="true"
            className={cn(
              "mt-2 text-sm leading-relaxed text-foreground/90 lg:text-base",
              stage < 0 && "opacity-0",
            )}
          >
            {STAGES[Math.max(stage, 0)]}
          </p>
          <ol className="sr-only">
            {STAGES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>

        {/* Resolution: the paper's identity arrives after you've seen it work. */}
        <motion.div
          initial={false}
          animate={{ opacity: stage >= 4 ? 1 : 0, y: stage >= 4 ? 0 : 30 }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          className="absolute right-6 bottom-8 left-6 has-[:focus-visible]:!opacity-100 lg:top-[12%] lg:right-[6vw] lg:bottom-auto lg:left-auto lg:max-w-xl lg:text-right"
        >
          <span className="font-display block text-5xl leading-none font-bold text-accent lg:text-8xl">
            {rds.year}
          </span>
          <h2 className="font-display mt-2 text-2xl leading-tight font-bold text-foreground lg:text-4xl">
            {rds.title}
          </h2>
          <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-muted">
            {rds.status.toUpperCase()} · {rds.publisher?.toUpperCase()}
          </p>
          <Link
            href={`/research/${rds.slug}`}
            className="group mt-4 inline-flex items-center gap-1.5 border-b border-accent/40 pb-0.5 text-sm text-foreground transition-colors hover:border-accent"
          >
            Read the case study
            <ArrowUpRight className="size-4 text-accent transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
