"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { SPRING_SNAPPY, UI } from "@/lib/motion";

const LINKS = [
  { href: "#research", label: "Research", index: "01" },
  { href: "#projects", label: "Projects", index: "02" },
  { href: "#findings", label: "Findings", index: "03" },
  { href: "#experience", label: "Experience", index: "05" },
  { href: "#about", label: "About", index: "09" },
  { href: "#contact", label: "Contact", index: "10" },
];

// Sections without their own nav link (github, education, skills,
// achievements) count toward the nearest preceding link so the nav still
// reflects roughly where the visitor is.
const SECTION_TO_LINK: Record<string, string> = {
  research: "#research",
  projects: "#projects",
  findings: "#findings",
  github: "#findings",
  experience: "#experience",
  education: "#experience",
  skills: "#experience",
  achievements: "#experience",
  about: "#about",
  contact: "#contact",
};

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = Object.keys(SECTION_TO_LINK)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHref(SECTION_TO_LINK[entry.target.id]);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-border bg-background/75 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a
          href="#home"
          className="flex items-center gap-2 font-mono text-sm font-medium tracking-tight text-foreground"
        >
          HARDIK
          <span className="hidden items-center gap-1.5 text-[10px] font-normal tracking-[0.14em] text-muted-2 sm:flex">
            <span className="relative flex size-1.5">
              <span className="node-pulse absolute inline-flex size-full rounded-full bg-verified opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-verified" />
            </span>
            SYSTEM ONLINE
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={activeHref === link.href ? "location" : undefined}
              className={cn(
                "group relative flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors duration-150 hover:text-foreground",
                activeHref === link.href ? "text-foreground" : "text-muted",
              )}
            >
              <span
                className={cn(
                  "font-mono text-[10px] transition-colors duration-150",
                  activeHref === link.href
                    ? "text-accent"
                    : "text-muted-2 group-hover:text-accent",
                )}
              >
                {link.index}
              </span>
              {link.label}
              {activeHref === link.href ? (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="absolute inset-x-3 -bottom-0 h-px bg-foreground"
                  transition={SPRING_SNAPPY}
                />
              ) : null}
            </a>
          ))}
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex items-center gap-1 border-l border-border pl-4 text-sm text-muted transition-colors hover:text-foreground"
          >
            GitHub
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-9 items-center justify-center rounded-md text-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={UI}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-md md:hidden"
          >
            <Container className="flex flex-col gap-1 py-3">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-2 py-2.5 text-base text-foreground/90 transition-colors hover:bg-surface"
                >
                  <span className="font-mono text-xs text-muted-2">
                    {link.index}
                  </span>
                  {link.label}
                </a>
              ))}
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-2.5 text-base text-foreground/90 transition-colors hover:bg-surface"
              >
                GitHub
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </Container>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
