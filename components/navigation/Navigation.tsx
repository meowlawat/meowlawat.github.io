"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { cn } from "@/lib/utils";
import { SECTIONS, goTo } from "@/lib/nav";

/**
 * Navigation is for navigation; scrolling is for exploration. Three plain
 * links to three plain sections, reachable in one click from anywhere —
 * including Contact, which used to require scrolling through an animated
 * sequence to reach.
 */
export function Navigation() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
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

  function go(id: string) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      goTo(id);
    };
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10">
      <a href="#home" className="font-mono text-xs tracking-[0.1em] text-foreground">
        Hardik Ahlawat
      </a>

      <nav aria-label="Sections" className="flex items-center gap-6 sm:gap-8">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={go(s.id)}
            aria-current={active === s.id ? "location" : undefined}
            className={cn(
              "text-sm transition-colors duration-300 ease-settle",
              active === s.id ? "text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {s.label}
          </a>
        ))}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          aria-label="Open command palette"
          className="hidden items-center gap-1 font-mono text-[11px] tracking-[0.08em] text-muted-2 transition-colors duration-300 ease-settle hover:text-foreground sm:inline-flex"
        >
          <span aria-hidden="true">⌘</span>K
        </button>
      </nav>
    </header>
  );
}
