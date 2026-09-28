"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SceneGraph, type SceneNode, type SceneLink } from "@/components/scenes/SceneGraph";
import { CaptionReel } from "@/components/scenes/CaptionReel";
import { research } from "@/data/research";
import { smoothSteps, useBand, useSceneProgress } from "@/lib/scroll";

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

// Scroll → record position t ∈ [0, 4]: t = i means "at node i".
const P0 = 0.1;
const P1 = 0.82;
const toT = (p: number) => Math.min(4, Math.max(0, ((p - P0) / (P1 - P0)) * 4));

export function RDSScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(-1);

  const p = useSceneProgress(ref);
  const t = useTransform(p, toT);

  // Node/link state is the only discrete thing here; it changes as the
  // record *approaches* each node, and the change itself is a long ease.
  useMotionValueEvent(p, "change", (v) => {
    setStage(v < 0.06 ? -1 : Math.min(4, Math.floor(toT(v) + 0.35)));
  });

  // ——— The record: one object, transformed along the way. ———
  const pdx = useTransform(t, [0, 1, 2, 3, 4], D_X);
  const pmy = useTransform(t, [0, 1, 2, 3, 4], M_Y);
  const presence = useTransform(p, [0.06, 0.11, 0.8, 0.82], [0, 1, 1, 0]);
  // Encrypted: dense, hatched, squared-off. Decrypted: an open ring.
  const hatch = useTransform(t, [0, 1.55, 1.95, 3.45, 3.85], [1, 1, 0, 0, 1]);
  const round = useTransform(t, [0, 1.6, 2, 3.4, 3.8], [0.18, 0.18, 1, 1, 0.18]);
  // Compressed passing through the boundary membrane, expands inside it.
  const rs = useTransform(
    t,
    [0, 1.28, 1.43, 1.62, 2, 3.4, 3.8],
    [0.85, 0.85, 0.66, 0.92, 1.3, 1.3, 0.85],
  );
  const inside = useBand(t, 1.45, 1.8, 3.5, 3.8);
  // Policy evaluation: a single ripple, scrubbed by scroll.
  const policyScale = useTransform(t, [2, 2.45], [1, 2.6]);
  const policyO = useTransform(t, [1.95, 2.05, 2.45], [0, 0.55, 0]);
  // Shadow view: a cleaner projection lifts off the record.
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

  // ——— Scene framing. ———
  const introO = useTransform(p, [0.02, 0.07], [1, 0]);
  const introY = useTransform(p, [0.02, 0.07], ["0vh", "-4vh"]);
  const graphO = useTransform(p, [0.03, 0.09], [0.35, 1]);
  const captionO = useBand(p, 0.05, 0.09);
  const captionPos = useTransform(t, (v) => smoothSteps(v + 0.35, 0.3));
  const titleO = useBand(t, 3.55, 3.95);
  const titleY = useTransform(t, [3.55, 3.95], [24, 0]);
  const titlePE = useTransform(titleO, (o) => (o > 0.5 ? "auto" : "none"));
  // Depth: the background word drifts slower than the stage.
  const bgY = useTransform(p, [0, 1], reduce ? ["0vh", "0vh"] : ["5vh", "-5vh"]);

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
    <section id="research" ref={ref} className="relative h-[430vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Background word — the scene's subject, at scale, at depth. */}
        <motion.span
          aria-hidden="true"
          style={{ y: bgY }}
          className="font-display pointer-events-none absolute -bottom-[6vw] -left-[2vw] text-[34vw] leading-none font-bold tracking-tighter text-foreground/[0.035] select-none"
        >
          TEE
        </motion.span>

        {/* Trusted boundary: a membrane the record has to pass through. */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: boundaryO, scale: boundaryS }}
          className="absolute top-[36%] left-[40%] hidden h-[27%] w-[38%] rounded-[3rem] border border-dashed border-verified-border lg:block"
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
          className="absolute top-[49%] left-[50%] hidden size-[26vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-border lg:block"
        >
          <span className="absolute -right-2 bottom-0 translate-x-full font-mono text-[10px] leading-relaxed tracking-[0.1em] text-accent-foreground">
            128 MB EPC
            <br />
            <span className="text-accent">{epc?.value} beyond it</span>
          </span>
        </motion.div>

        <motion.div
          style={{ opacity: graphO }}
          className="absolute inset-x-6 top-[12%] bottom-[32%] lg:inset-x-[6vw] lg:top-[16%] lg:bottom-[20%]"
        >
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
                opacity: presence,
              } as unknown as CSSProperties
            }
            className="pointer-events-none absolute top-[calc(var(--pmy)*1%)] left-[22%] z-20 lg:top-[52%] lg:left-[calc(var(--pdx)*1%)]"
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
              className="absolute -top-2 right-4 text-right font-mono text-[11px] whitespace-nowrap text-accent-foreground lg:top-auto lg:right-auto lg:bottom-5 lg:left-0 lg:-translate-x-1/2 lg:text-left"
            >
              {metric("Mean query latency")?.value}
              <br className="lg:hidden" /> / query
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Intro: what you're about to watch. Drifts away as the record moves. */}
        <motion.div
          style={{ opacity: introO, y: introY }}
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

        {/* Live caption: the sentence that is true right now. On small
            screens the title takes this slot at the end. */}
        <motion.div
          style={{ opacity: captionO }}
          className="absolute right-6 bottom-8 left-6 lg:right-auto lg:bottom-[9%] lg:left-[6vw] lg:max-w-md"
        >
          <div
            className={
              "transition-opacity duration-700 ease-settle " + (stage >= 4 ? "max-lg:opacity-0" : "")
            }
          >
            <CaptionReel items={STAGES} pos={captionPos} />
          </div>
        </motion.div>

        {/* Resolution: the paper's identity settles in once you've seen it work. */}
        <motion.div
          style={{ opacity: titleO, y: titleY, pointerEvents: titlePE }}
          className="absolute right-6 bottom-8 left-6 has-[:focus-visible]:!pointer-events-auto has-[:focus-visible]:!opacity-100 lg:top-[12%] lg:right-[6vw] lg:bottom-auto lg:left-auto lg:max-w-xl lg:text-right"
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
            className="group mt-4 inline-flex items-center gap-1.5 border-b border-accent/40 pb-0.5 text-sm text-foreground transition-colors duration-300 ease-settle hover:border-accent"
          >
            Read the case study
            <ArrowUpRight className="size-4 text-accent transition-transform duration-300 ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
