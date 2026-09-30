"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { SPRING_SNAPPY } from "@/lib/motion";
import { site } from "@/data/site";

// Contact is pinned for 240vh, and its text only resolves past the
// midpoint of that track (ContactScene's own "system quiets, then
// resolves" narrative). Arriving by continuous scroll, that quieting is
// the point. Arriving by a direct click or a shared link, it's a wall
// between the visitor and the one thing they came for — so a jump here
// lands past the resolve point instead of at the section's top.
function jumpToContact(behavior: ScrollBehavior) {
  const el = document.getElementById("contact");
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + el.offsetHeight * 0.64, behavior });
}

const SCENES = [
  { href: "#research", index: "01", label: "Research" },
  { href: "#projects", index: "02", label: "Systems" },
  { href: "#findings", index: "03", label: "Findings" },
  { href: "#about", index: "04", label: "Identity" },
  { href: "#contact", index: "05", label: "Contact" },
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

/**
 * A spatial index rather than a documentation navbar: five scene numbers,
 * and a signal dot that travels to whichever scene you're in.
 */
export function Navigation() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // A shared/bookmarked #contact link lands here the same instant, broken
  // way a click would — the browser's own hash-jump goes to the section
  // top before React mounts. Correct it once, without animating (the
  // visitor never saw the top position to begin with).
  useEffect(() => {
    if (window.location.hash === "#contact") jumpToContact("auto");
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

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-6 pt-5 md:px-[3vw]">
      <a
        href="#home"
        className="pointer-events-auto font-mono text-xs font-medium tracking-[0.18em] text-foreground mix-blend-difference"
      >
        HARDIK AHLAWAT
      </a>

      <div className="pointer-events-auto flex items-center gap-4">
        {/* Reachable from anywhere, no scrolling required — the direct
            answer to "where's your contact info," not a fifth scene away. */}
        <a
          href={`mailto:${site.email}`}
          className="hidden font-mono text-[11px] tracking-[0.14em] text-muted-2 uppercase transition-colors hover:text-foreground sm:inline-block"
        >
          Email
        </a>
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
                    onClick={
                      s.href === "#contact"
                        ? (e) => {
                            e.preventDefault();
                            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                            jumpToContact(reduce ? "auto" : "smooth");
                            window.history.pushState(null, "", "#contact");
                          }
                        : undefined
                    }
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
      </div>
    </header>
  );
}
