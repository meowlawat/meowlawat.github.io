"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { research } from "@/data/research";
import { projects } from "@/data/projects";
import { FAST } from "@/lib/motion";

const find = <T extends { slug: string }>(list: T[], slug: string) =>
  list.find((item) => item.slug === slug)!;

// Four items, curated — not the full research+project+findings catalog.
// Order and selection are the owner's own call (see the design spec).
const rds = find(research, "runtime-data-shadowing");
const mpls = find(projects, "mpls-predictive-copilot");
const lstm = find(research, "lstm-password-guessing-argon2id");
const metering = find(research, "token-accounting-integrity-llm-metering");

// "Accepted — ETTIS 2026" -> "Accepted" (the year is already shown
// separately; repeating it in the meta line would be redundant).
const verb = (status: string) => status.split("—")[0].trim();

const WORK = [
  {
    title: rds.title,
    subtitle: rds.subtitle,
    year: rds.year,
    meta: `${verb(rds.status)} · ${rds.publisher}`,
    href: `/research/${rds.slug}`,
  },
  {
    title: mpls.title,
    subtitle: mpls.tagline,
    year: mpls.year ?? "",
    meta: mpls.category,
    href: `/projects/${mpls.slug}`,
  },
  {
    title: lstm.title,
    subtitle: lstm.subtitle,
    year: lstm.year,
    meta: `${verb(lstm.status)} · ${lstm.publisher}`,
    href: `/research/${lstm.slug}`,
  },
  {
    title: metering.title,
    subtitle: metering.subtitle,
    year: metering.year,
    meta: `${verb(metering.status)} · ${metering.publisher}`,
    href: `/research/${metering.slug}`,
  },
];

function WorkRow({ item, index }: { item: (typeof WORK)[number]; index: number }) {
  return (
    <Link
      href={item.href}
      className="group block border-t border-border py-10 first:border-t-0 sm:py-12"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-baseline gap-5 sm:gap-8">
          <span className="font-mono text-xs text-muted-2">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <motion.h3
              initial={false}
              whileHover={{ x: 6 }}
              whileFocus={{ x: 6 }}
              transition={FAST}
              className="font-display text-2xl font-bold text-foreground transition-colors duration-300 ease-settle group-hover:text-home-accent sm:text-4xl"
            >
              {item.title}
            </motion.h3>
            <p className="mt-2 max-w-md text-sm text-muted sm:text-base">{item.subtitle}</p>
            <p className="mt-2 font-mono text-[11px] tracking-[0.06em] text-muted-2 uppercase">
              {item.meta}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-1 font-mono text-sm text-muted-2">
          <span>{item.year}</span>
          <span
            aria-hidden="true"
            className="opacity-0 transition-[opacity,transform] duration-300 ease-settle group-hover:translate-x-1 group-hover:opacity-100"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function SelectedWork() {
  return (
    <section id="work" className="py-28 sm:py-36">
      <Container>
        <p className="font-mono text-xs tracking-[0.14em] text-muted-2 uppercase">Selected work</p>
        <div className="mt-10">
          {WORK.map((item, i) => (
            <WorkRow key={item.href} item={item} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
