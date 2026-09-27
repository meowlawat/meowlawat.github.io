"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  SceneGraph,
  type LinkState,
  type NodeState,
  type SceneLink,
  type SceneNode,
} from "@/components/scenes/SceneGraph";
import { projects } from "@/data/projects";
import { cn } from "@/lib/utils";

const mpls = projects.find((p) => p.slug === "mpls-predictive-copilot")!;

// Each caption restates a fact from the project's own architecture /
// implementation notes; the sequence mirrors its fault-injection demos.
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

// Network plane (teal) below, analysis plane (cobalt) above.
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
    if (s >= 5 && ["a", "pe1", "pe2", "b"].includes(id)) return id === "pe2" ? "verified" : "system";
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

export function MPLSScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const t = Math.min(5.99, Math.max(0, ((p - 0.08) / 0.76) * 6));
    setStage(p < 0.05 ? -1 : Math.floor(t));
  });

  const s = stage;
  const nodes: SceneNode[] = PLANE.map((p) => ({
    ...p,
    state: nodeState(p.id, s),
    tag: TAGS[s]?.[p.id],
  }));
  const links: SceneLink[] = LINKS.map(([from, to]) => ({
    from,
    to,
    state: linkState(`${from}-${to}`, s),
  }));

  const blast = s === 4 || s === 5;

  return (
    <section id="projects" ref={ref} className="relative h-[560vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute -right-[3vw] -bottom-[5vw] text-[30vw] leading-none font-bold tracking-tighter text-system/[0.07] select-none"
        >
          MPLS
        </span>

        <motion.div
          initial={false}
          animate={{ opacity: s < 0 ? 0.3 : 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-x-6 top-[12%] bottom-[36%] lg:inset-x-[6vw] lg:top-[18%] lg:bottom-[20%]"
        >
          {/* Blast radius: grows out of PE-1 once NetworkX runs. */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{ opacity: blast ? 1 : 0, scale: blast ? 1 : 0.2 }}
            transition={{ type: "spring", stiffness: 70, damping: 16 }}
            className="absolute top-[34%] left-[62%] size-[46vw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-border bg-accent-soft/40 lg:top-[58%] lg:left-[36%] lg:size-[34vh]"
          />
          <SceneGraph nodes={nodes} links={links} />
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: s < 0 ? 1 : 0, y: s < 0 ? 0 : -24 }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          className="pointer-events-none absolute bottom-[8%] left-6 max-w-md lg:left-[6vw]"
        >
          <span className="font-mono text-[11px] tracking-[0.18em] text-system">
            02 / SYSTEMS
          </span>
          <p className="font-display mt-3 text-3xl leading-tight font-bold text-foreground lg:text-5xl">
            One network.
            <br />
            <span className="text-system">One failure.</span>
          </p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.12em] text-muted-2">
            SCROLL TO RUN THE SEQUENCE ↓
          </p>
        </motion.div>

        <div className={cn("absolute right-6 bottom-8 left-6 transition-opacity duration-500 lg:right-auto lg:bottom-[8%] lg:left-[6vw] lg:max-w-lg", s < 0 && "opacity-0", s >= 5 && "max-lg:opacity-0")}>
          <span className="font-mono text-[10px] tracking-[0.14em] text-muted-2">
            STATE {String(Math.max(s, 0) + 1).padStart(2, "0")} / 06 · ILLUSTRATIVE,
            MODELED ON THE PROJECT&rsquo;S FAULT-INJECTION DEMOS
          </span>
          <p aria-hidden="true" className="mt-2 text-sm leading-relaxed text-foreground/90 lg:text-base">
            {s >= 0 ? STAGES[s] : " "}
          </p>
          <ol className="sr-only">
            {STAGES.map((st) => (
              <li key={st}>{st}</li>
            ))}
          </ol>
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: s >= 5 ? 1 : 0, y: s >= 5 ? 0 : 30 }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          className="absolute right-6 bottom-8 left-6 has-[:focus-visible]:!opacity-100 lg:right-[6vw] lg:bottom-[7%] lg:left-auto lg:max-w-sm lg:text-right"
        >
          <h2 className="font-display text-3xl leading-[0.95] font-bold text-foreground lg:text-5xl">
            MPLS
            <br />
            <span className="text-system">Predictive</span>
            <br />
            Copilot
          </h2>
          <p className="mt-2 text-sm text-muted">{mpls.tagline}</p>
          <div className="mt-4 flex flex-col items-start gap-2 text-sm lg:items-end">
            <Link
              href={`/projects/${mpls.slug}`}
              className="group inline-flex items-center gap-1.5 border-b border-system/40 pb-0.5 text-foreground transition-colors hover:border-system"
            >
              Explore the system
              <ArrowUpRight className="size-4 text-system transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            {mpls.links.repo ? (
              <a
                href={mpls.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] text-muted transition-colors hover:text-foreground"
              >
                SOURCE
                <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
