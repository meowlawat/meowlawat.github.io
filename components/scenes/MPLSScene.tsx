"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  SceneGraph,
  type LinkState,
  type NodeState,
  type SceneLink,
  type SceneNode,
  type SceneTrace,
} from "@/components/scenes/SceneGraph";
import { CaptionReel } from "@/components/scenes/CaptionReel";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import { useBand, smoothSteps } from "@/lib/scroll";
import { SLOW } from "@/lib/motion";

const mpls = projects.find((p) => p.slug === "mpls-predictive-copilot")!;

const STAGES = [
  "Containerlab runs a 4-node MPLS topology — Branch-A, PE-1, PE-2, Branch-B. Traffic is flowing.",
  "Telegraf and Prometheus stream utilization, latency, jitter, packet loss, BGP flaps and OSPF changes.",
  "A fault is injected: progressive congestion builds on the PE-1 → Branch-B path.",
  "An 8-feature LightGBM model predicts time-to-impact, with a confidence score, before the path fails.",
  "NetworkX maps the blast radius and searches the topology for a backup path.",
  "Traffic moves to the backup path. A local LLM, grounded in runbooks, briefs the operator — no cloud calls.",
];

type Plane = {
  id: string;
  label: string;
  d: [number, number];
  m: [number, number];
  mSide?: "left" | "right";
  note: string;
  size?: number;
};

const PLANE: Plane[] = [
  { id: "a", label: "Branch-A", d: [9, 74], m: [78, 4], mSide: "left", note: "Customer edge site.", size: 20 },
  { id: "pe1", label: "PE-1", d: [36, 58], m: [62, 34], mSide: "left", note: "Provider edge router.", size: 24 },
  { id: "pe2", label: "PE-2", d: [54, 90], m: [92, 58], mSide: "left", note: "Provider edge router — the backup route.", size: 24 },
  { id: "b", label: "Branch-B", d: [80, 66], m: [78, 90], mSide: "left", note: "Customer edge site.", size: 20 },
  { id: "tel", label: "Telemetry", d: [20, 14], m: [6, 10], note: "Telegraf → Prometheus, multi-signal." },
  { id: "lgbm", label: "LightGBM", d: [40, 8], m: [6, 30], note: "8-feature time-to-impact model." },
  { id: "nx", label: "NetworkX", d: [60, 14], m: [6, 50], note: "Blast radius + backup-path search." },
  { id: "llm", label: "Local LLM", d: [78, 8], m: [6, 70], note: "Runbook-grounded, via Ollama. Air-gapped." },
  { id: "op", label: "Operator", d: [95, 20], m: [6, 90], note: "Receives confidence-scored guidance." },
];

function nodeState(id: string, s: number): NodeState {
  const network = ["a", "pe1", "pe2", "b"].includes(id);
  if (network) {
    if (s >= 5) return id === "pe2" ? "verified" : "system";
    if (s >= 2 && id === "b") return "degraded";
    return s >= 0 ? "system" : "idle";
  }
  const at: Record<string, number> = { tel: 1, lgbm: 3, nx: 4, llm: 5, op: 5 };
  if (s < at[id]) return "idle";
  return id === "op" && s >= 5 ? "verified" : "active";
}

function linkState(key: string, s: number): LinkState {
  switch (key) {
    case "a-pe1":
      return s >= 5 ? "verified" : s >= 0 ? "flow" : "idle";
    case "pe1-b":
      return s >= 2 ? "degraded" : s >= 0 ? "flow" : "idle";
    case "pe1-pe2":
    case "pe2-b":
      return s >= 5 ? "verified" : "idle";
    case "pe1-tel":
      return s >= 1 ? "signal" : "idle";
    case "tel-lgbm":
      return s >= 3 ? "signal" : "idle";
    case "lgbm-nx":
      return s >= 4 ? "signal" : "idle";
    case "nx-llm":
    case "llm-op":
      return s >= 5 ? "signal" : "idle";
    default:
      return "idle";
  }
}

const LINKS: [string, string][] = [
  ["a", "pe1"],
  ["pe1", "b"],
  ["pe1", "pe2"],
  ["pe2", "b"],
  ["pe1", "tel"],
  ["tel", "lgbm"],
  ["lgbm", "nx"],
  ["nx", "llm"],
  ["llm", "op"],
];

const TAGS: Record<number, Record<string, string>> = {
  1: { tel: "latency · jitter · loss · BGP · OSPF" },
  2: { b: "congestion building" },
  3: { lgbm: "time-to-impact · confidence-scored" },
  4: { nx: "blast radius → backup path" },
  5: { pe2: "backup path active", op: "system recovered" },
};

/**
 * Click-driven, not scroll-driven — same model as RDSScene. `t` animates
 * to the clicked stage and the existing transform chains (congestion,
 * prediction, blast radius, backup-path draw) all still work unchanged.
 */
export function MPLSScene() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const t = useMotionValue(0);

  useEffect(() => {
    const controls = animate(t, stage, reduce ? { duration: 0 } : { ...SLOW, stiffness: 90, damping: 22 });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const nodes: SceneNode[] = PLANE.map((n) => ({
    ...n,
    state: nodeState(n.id, stage),
    tag: TAGS[stage]?.[n.id],
  }));
  const links: SceneLink[] = LINKS.map(([from, to]) => ({
    from,
    to,
    state: linkState(`${from}-${to}`, stage),
  }));

  const congestion = useTransform(t, [2, 3], [0, 1]);
  const prediction = useTransform(t, [2.6, 3.6], [0, 1]);
  const blastO = useTransform(t, [3.7, 4.3, 5.35, 5.95], [0, 1, 1, 0.55]);
  const blastS = useTransform(t, [3.7, 4.3, 5.35, 5.95], [0.3, 1, 1, 0.92]);
  const backupDraw = useTransform(t, [4.55, 5.3], [0, 1]);

  const traces: SceneTrace[] = reduce
    ? []
    : [
        { from: "pe1", to: "b", kind: "pulse", tone: "degraded", progress: congestion },
        { from: "tel", to: "lgbm", kind: "pulse", tone: "signal", progress: prediction },
        { from: "pe1", to: "pe2", kind: "grow", tone: "verified", progress: backupDraw },
        { from: "pe2", to: "b", kind: "grow", tone: "verified", progress: backupDraw },
      ];

  const captionPos = useTransform(t, (v) => smoothSteps(v, 0.35));
  const titleO = useBand(t, 5.3, 5.8);
  const titleY = useTransform(t, [5.3, 5.8], [16, 0]);

  return (
    <section id="projects" className="relative px-6 py-24 md:px-[6vw] md:py-32">
      <Reveal>
        <span className="font-mono text-[11px] tracking-[0.18em] text-system">
          03 / SYSTEMS
        </span>
        <p className="font-display mt-3 text-3xl leading-tight font-bold text-foreground md:text-5xl">
          One network.
          <br />
          <span className="text-system">One failure.</span>
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Click a step to run the sequence — illustrative, modeled on MPLS Predictive Copilot&rsquo;s
          own fault-injection demos.
        </p>
      </Reveal>

      <div role="tablist" aria-label="Fault sequence" className="mt-10 flex flex-wrap gap-2">
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
                ? "border-system bg-system-soft text-foreground"
                : "border-border-strong text-muted hover:text-foreground",
            )}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      <div className="relative mt-6 h-[58vh] min-h-[26rem] rounded-2xl border border-border bg-surface/40 md:h-[50vh]">
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -right-[2%] -bottom-[6%] text-[20vw] leading-none font-bold tracking-tighter text-system/[0.07] select-none md:text-[13vw]"
        >
          MPLS
        </span>

        <motion.div
          aria-hidden="true"
          style={{ opacity: blastO, scale: blastS }}
          className="absolute top-[34%] left-[62%] size-[40vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-border bg-accent-soft/40 md:top-[58%] md:left-[36%] md:size-[28vh]"
        />

        <div className="absolute inset-x-6 top-[8%] bottom-[30%] md:inset-x-[5%] md:top-[14%] md:bottom-[16%]">
          <SceneGraph nodes={nodes} links={links} traces={traces} />
        </div>
      </div>

      <div className="mt-6 max-w-2xl">
        <CaptionReel
          items={STAGES}
          pos={captionPos}
          note="ILLUSTRATIVE, MODELED ON THE PROJECT’S FAULT-INJECTION DEMOS"
        />
      </div>

      <motion.div style={{ opacity: titleO, y: titleY }} className="mt-10 max-w-xl">
        {mpls.year ? (
          <span className="font-display block text-3xl leading-none font-bold text-system md:text-4xl">
            {mpls.year}
          </span>
        ) : null}
        <h2 className="font-display mt-2 text-2xl leading-[0.95] font-bold text-foreground md:text-3xl">
          MPLS <span className="text-system">Predictive</span> Copilot
        </h2>
        <p className="mt-2 text-sm text-muted">{mpls.tagline}</p>
        <p className="mt-2 font-mono text-[10px] tracking-[0.1em] text-muted-2 uppercase">
          {mpls.stack.slice(0, 4).join(" · ")}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-5 text-sm">
          <Link
            href={`/projects/${mpls.slug}`}
            className="group inline-flex items-center gap-1.5 border-b border-system/40 pb-0.5 text-foreground transition-colors duration-300 ease-settle hover:border-system"
          >
            Explore the system
            <ArrowUpRight className="size-4 text-system transition-transform duration-300 ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          {mpls.links.repo ? (
            <a
              href={mpls.links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] text-muted transition-colors duration-300 ease-settle hover:text-foreground"
            >
              SOURCE
              <ArrowUpRight className="size-3.5 transition-transform duration-300 ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}
