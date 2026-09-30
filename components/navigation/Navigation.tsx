"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SPRING_SNAPPY } from "@/lib/motion";

// Most scenes are pinned, multi-screen scroll tracks whose correct initial
// state *is* their top (the narrative's deliberate start — intro visible,
// nothing yet reached). Contact is the exception: it's a destination, not
// a narrative, and its "system quiets" text only resolves past the
// midpoint of its own track — so a direct jump there lands past that
// point instead of at the top, while everything else lands at zero.
const SCENES = [
  { id: "research", href: "#research", index: "01", label: "Research", landAt: 0 },
  { id: "projects", href: "#projects", index: "02", label: "Systems", landAt: 0 },
  { id: "findings", href: "#findings", index: "03", label: "Findings", landAt: 0 },
  { id: "about", href: "#about", index: "04", label: "Identity", landAt: 0 },
  { id: "contact", href: "#contact", index: "05", label: "Contact", landAt: 0.64 },
];

// Scenes without their own index entry count toward the nearest one.
const SECTION_TO_SCENE: Record<string, string> = {
  research: "#research",
  experiments: "#research",
  projects: "#projects",
  findings: "#findings",
  about: "#about",
  experience: "#about",
  contact: "#contact",
};

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// One jump for every destination: smooth in motion (respecting reduced
// motion), instant in intent — no scrolling through what's in between.
function jumpTo(id: string, landAt: number, behavior: ScrollBehavior) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + el.offsetHeight * landAt, behavior });
}

/**
 * A spatial index rather than a documentation navbar: five scene numbers
 * with a signal dot that travels to whichever scene you're in, plus a
 * standalone Contact shortcut — the one destination a visitor might want
 * without reading the rest of the site first. Scroll is still how you
 * explore; this is how you jump.
 */
export function Navigation() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // A shared/bookmarked #contact link lands here the same instant, broken
  // way a click would — the browser's own hash-jump goes to the section
  // top before React mounts. Correct it once, without animating (the
  // visitor never saw the top position to begin with).
  useEffect(() => {
    const hash = window.location.hash;
    const scene = SCENES.find((s) => s.href === hash);
    if (scene && scene.landAt > 0) jumpTo(scene.id, scene.landAt, "auto");
  }, []);

  useEffect(() => {
    const els = Object.keys(SECTION_TO_SCENE)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(SECTION_TO_SCENE[e.target.id]);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    const top = () => window.scrollY < window.innerHeight * 0.5 && setActive(null);
    window.addEventListener("scroll", top, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", top);
    };
  }, []);

  function go(scene: (typeof SCENES)[number]) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      jumpTo(scene.id, scene.landAt, reducedMotion() ? "auto" : "smooth");
      window.history.pushState(null, "", scene.href);
    };
  }

  const contact = SCENES[4];

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-6 pt-5 md:px-[3vw]">
      <a
        href="#home"
        className="pointer-events-auto font-mono text-xs font-medium tracking-[0.18em] text-foreground mix-blend-difference"
      >
        HARDIK AHLAWAT
      </a>

      <div className="pointer-events-auto flex items-center gap-4">
        <nav aria-label="Scenes">
          <ol className="flex items-center gap-1 rounded-full border border-border bg-background/60 px-2 py-1.5 backdrop-blur-md">
            {SCENES.map((s) => {
              const isActive = active === s.href;
              const showLabel = isActive || hovered === s.href;
              return (
                <li key={s.href}>
                  <a
                    href={s.href}
                    aria-current={isActive ? "location" : undefined}
                    aria-label={`${s.index} ${s.label}`}
                    onClick={go(s)}
                    onMouseEnter={() => setHovered(s.href)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(s.href)}
                    onBlur={() => setHovered(null)}
                    className={cn(
                      "relative flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors",
                      isActive ? "text-foreground" : "text-muted-2 hover:text-foreground",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="scene-signal"
                        transition={SPRING_SNAPPY}
                        className="absolute top-1/2 left-1 size-1.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_2px_var(--accent-soft)]"
                      />
                    ) : null}
                    <span className={cn(isActive && "pl-2")}>{s.index}</span>
                    <motion.span
                      initial={false}
                      animate={{ width: showLabel ? "auto" : 0, opacity: showLabel ? 1 : 0 }}
                      transition={SPRING_SNAPPY}
                      className="hidden overflow-hidden whitespace-nowrap uppercase tracking-[0.1em] sm:inline-block"
                    >
                      {s.label}
                    </motion.span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Reachable from anywhere, no scrolling required — the direct
            answer to "where's your contact info," not a fifth scene away.
            Lands on the same contact scene the index's 05 does; it's a
            shortcut to that destination, not a second source of it. */}
        <a
          href={contact.href}
          onClick={go(contact)}
          className="group hidden items-center gap-1 font-mono text-[11px] tracking-[0.12em] text-muted-2 uppercase transition-colors hover:text-foreground sm:inline-flex"
        >
          Contact
          <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </header>
  );
}
