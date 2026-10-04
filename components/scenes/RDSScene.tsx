"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SceneGraph, type SceneNode, type SceneLink } from "@/components/scenes/SceneGraph";
import { CaptionReel } from "@/components/scenes/CaptionReel";
import { Reveal } from "@/components/ui/Reveal";
import { research } from "@/data/research";
import { useBand, smoothSteps } from "@/lib/scroll";
import { SLOW } from "@/lib/motion";
import { cn } from "@/lib/utils";

const rds = research.find((r) => r.slug === "runtime-data-shadowing")!;
const metric = (label: string) => rds.metrics.find((m) => m.label === label);

// Each stage is a sentence from the paper's own approach / threat model.
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

// A horizontal path across the stage (desktop); vertical on mobile.
const D_X = [10, 30, 50, 70, 90];
const M_Y = [16, 33, 50, 67, 84];
const ids = ["client", "encrypted", "enclave", "shadow", "result"];

/**
 * Click-driven, not scroll-driven: a bounded panel in normal page flow.
 * Clicking a step (or the record itself) animates one continuous `t`
 * value (0-4) to the target — the same transform chains that used to read
 * scroll position now read this instead, so the record still visibly
 * travels and transforms between states, just on a click, not a scroll.
 * Scrolling past this section is always just scrolling.
 */
export function RDSScene() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const t = useMotionValue(0);

  useEffect(() => {
    const controls = animate(t, stage, reduce ? { duration: 0 } : { ...SLOW, stiffness: 90, damping: 20 });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // ——— The record: one object, transformed along the way. ———
  const pdx = useTransform(t, [0, 1, 2, 3, 4], D_X);
  const pmy = useTransform(t, [0, 1, 2, 3, 4], M_Y);
  const hatch = useTransform(t, [0, 1.55, 1.95, 3.45, 3.85], [1, 1, 0, 0, 1]);
  const round = useTransform(t, [0, 1.6, 2, 3.4, 3.8], [0.18, 0.18, 1, 1, 0.18]);
  const rs = useTransform(
    t,
    [0, 1.28, 1.43, 1.62, 2, 3.4, 3.8],
    [0.85, 0.85, 0.66, 0.92, 1.3, 1.3, 0.85],
  );
  const inside = useBand(t, 1.45, 1.8, 3.5, 3.8);
  const policyScale = useTransform(t, [2, 2.45], [1, 2.6]);
  const policyO = useTransform(t, [1.95, 2.05, 2.45], [0, 0.55, 0]);
  const ghostO = useBand(t, 2.55, 3.05, 3.45, 3.7);
  const ghostY = useTransform(t, [2.55, 3.05], [0, -16]);
  const latencyO = useBand(t, 0.1, 0.4, 3.2, 3.5);

  // ——— Instrumentation that emerges from the work. ———
  const boundaryO = useBand(t, 0.55, 1.05);
  const boundaryS = useTransform(t, [0.55, 1.05], [0.97, 1]);
  const membraneIn = useTransform(t, [1.25, 1.43, 1.75], [0, 1, 0]);
  const membraneOut = useTransform(t, [3.42, 3.6, 3.9], [0, 1, 0]);
  const epcO = useBand(t, 1.75, 2.25);
  const epcS = useTransform(t, [1.75, 2.25], [0.9, 1]);
  const overheadO = useBand(t, 2.45, 2.8);
  const throughputO = useBand(t, 3.86, 4);
  const titleO = useBand(t, 3.5, 3.9);
  const titleY = useTransform(t, [3.5, 3.9], [16, 0]);

  const captionPos = useTransform(t, (v) => smoothSteps(v, 0.3));

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
        i === 2
          ? `${metric("Overhead")?.value} overhead`
          : i === 4
            ? `${metric("Throughput")?.value} ops/sec`
            : undefined,
      tagOpacity: i === 2 ? overheadO : i === 4 ? throughputO : undefined,
    };
  });

  const links: SceneLink[] = ids.slice(0, -1).map((id, i) => ({
    from: id,
    to: ids[i + 1],
    state: stage > i ? (i >= 1 && i <= 2 ? "verified" : "signal") : "idle",
  }));

  const epc = metric("Latency degradation");

  return (
    <section id="research" className="relative px-6 py-24 md:px-[6vw] md:py-32">
      <Reveal>
        <span className="font-mono text-[11px] tracking-[0.18em] text-accent">
          02 / RESEARCH
        </span>
        <p className="font-display mt-3 text-3xl leading-tight font-bold text-foreground md:text-5xl">
          Follow one
          <br />
          <span className="text-accent">medical record.</span>
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Click a step to move the record through Runtime Data Shadowing — a trusted-execution
          approach for sharing medical data under role-aware access control.
        </p>
      </Reveal>

      {/* Step controls — the actual interaction, not a scroll position. */}
      <div role="tablist" aria-label="Record state" className="mt-10 flex flex-wrap gap-2">
        {STAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={stage === i}
            onClick={() => setStage(i)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] transition-colors duration-300 ease-settle",
              stage === i
                ? "border-accent bg-accent-soft text-accent-foreground"
                : "border-border-strong text-muted hover:text-foreground",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      <div className="relative mt-6 h-[52vh] min-h-[22rem] rounded-2xl border border-border bg-surface/40 md:h-[46vh]">
        {/* Background word — depth, not decoration. */}
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -bottom-[6%] -left-[2%] text-[22vw] leading-none font-bold tracking-tighter text-foreground/[0.035] select-none md:text-[14vw]"
        >
          TEE
        </span>

        {/* Trusted boundary: a membrane the record has to pass through. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: boundaryO, scale: boundaryS }}
          className="absolute top-[30%] left-[38%] hidden h-[34%] w-[40%] rounded-[2.5rem] border border-dashed border-verified-border lg:block"
        >
          <span className="absolute -top-6 left-6 font-mono text-[10px] tracking-[0.14em] text-verified">
            TRUSTED BOUNDARY / SGX
          </span>
          <motion.span
            style={{ opacity: membraneIn }}
            className="absolute top-[18%] -left-px h-[64%] w-px bg-verified shadow-[0_0_12px_2px_var(--verified-soft)]"
          />
          <motion.span
            style={{ opacity: membraneOut }}
            className="absolute top-[18%] -right-px h-[64%] w-px bg-verified shadow-[0_0_12px_2px_var(--verified-soft)]"
          />
        </motion.div>

        {/* EPC threshold ring: the scalability wall, as a physical limit. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: epcO, scale: epcS }}
          className="absolute top-[47%] left-[50%] hidden size-[20vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-border lg:block"
        >
          <span className="absolute -right-2 bottom-0 translate-x-full font-mono text-[10px] leading-relaxed tracking-[0.1em] text-accent-foreground">
            128 MB EPC
            <br />
            <span className="text-accent">{epc?.value} beyond it</span>
          </span>
        </motion.div>

        <div className="absolute inset-x-6 top-[10%] bottom-[8%] md:inset-x-[5%] md:top-[14%] md:bottom-[14%]">
          <SceneGraph nodes={nodes} links={links} />

          {/* The record itself, carrying its latency with it. */}
          <motion.div
            aria-hidden="true"
            style={
              {
                "--pdx": pdx,
                "--pmy": pmy,
                "--hatch": hatch,
                "--round": round,
                "--rs": rs,
                "--inside": inside,
              } as unknown as CSSProperties
            }
            className="pointer-events-none absolute top-[calc(var(--pmy)*1%)] left-[22%] z-20 md:top-[52%] md:left-[calc(var(--pdx)*1%)]"
          >
            <motion.span
              style={{ scale: policyScale, opacity: policyO }}
              className="absolute -top-2.5 -left-2.5 size-5 rounded-full border border-verified"
            />
            <motion.span
              style={{ y: ghostY, opacity: ghostO }}
              className="absolute -top-2.5 -left-2.5 size-5 rounded-full border border-dashed border-accent-foreground/70"
            />
            <span className="absolute -top-[7px] -left-[7px] size-3.5 scale-[var(--rs)] overflow-hidden rounded-[calc(var(--round)*50%)] border-[1.5px] border-accent-foreground">
              <span
                className="absolute inset-0 bg-accent opacity-[var(--hatch)]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, transparent 0 2px, rgba(8,10,13,0.55) 2px 3px)",
                }}
              />
            </span>
            <span className="absolute -top-[7px] -left-[7px] size-3.5 scale-[var(--rs)] rounded-[calc(var(--round)*50%)] border-[1.5px] border-verified opacity-[var(--inside)]" />
            <motion.span
              style={{ opacity: latencyO }}
              className="absolute -top-2 right-4 text-right font-mono text-[11px] whitespace-nowrap text-accent-foreground md:top-auto md:right-auto md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:text-center"
            >
              {metric("Mean query latency")?.value} / query
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* Live caption: the sentence that is true at the current step. */}
      <div className="mt-6 max-w-2xl">
        <CaptionReel items={STAGES} pos={captionPos} />
      </div>

      {/* Resolution: the paper's identity, once you've clicked through. */}
      <motion.div style={{ opacity: titleO, y: titleY }} className="mt-10 max-w-xl">
        <span className="font-display block text-4xl leading-none font-bold text-accent md:text-6xl">
          {rds.year}
        </span>
        <h2 className="font-display mt-2 text-2xl leading-tight font-bold text-foreground md:text-3xl">
          {rds.title}
        </h2>
        <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-muted">
          {rds.status.toUpperCase()} · {rds.publisher?.toUpperCase()}
        </p>
        <p className="mt-2 font-mono text-[10px] tracking-[0.1em] text-muted-2 uppercase">
          {rds.technologies.join(" · ")}
        </p>
        <Link
          href={`/research/${rds.slug}`}
          className="group mt-4 inline-flex items-center gap-1.5 border-b border-accent/40 pb-0.5 text-sm text-foreground transition-colors duration-300 ease-settle hover:border-accent"
        >
          Read the case study
          <ArrowUpRight className="size-4 text-accent transition-transform duration-300 ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>
    </section>
  );
}
