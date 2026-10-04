"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAST } from "@/lib/motion";
import { SCENES, goToScene, type SceneDestination } from "@/lib/nav";
import { site } from "@/data/site";

type Item =
  | { kind: "scene"; scene: SceneDestination }
  | { kind: "link"; label: string; href: string; external: boolean };

const LINKS: Item[] = [
  { kind: "link", label: "Email", href: `mailto:${site.email}`, external: false },
  { kind: "link", label: "GitHub", href: site.github, external: true },
  { kind: "link", label: "LinkedIn", href: site.linkedin, external: true },
  { kind: "link", label: "ORCID", href: site.orcid, external: true },
];

const ITEMS: Item[] = [...SCENES.map((scene): Item => ({ kind: "scene", scene })), ...LINKS];

function itemLabel(item: Item): string {
  return item.kind === "scene" ? item.scene.label : item.label;
}

function itemTag(item: Item): string {
  return item.kind === "scene" ? item.scene.index : "LINK";
}

/**
 * ⌘K / Ctrl+K: a keyboard-first way to reach the same five scenes and
 * contact links the header's index and Contact shortcut already go to —
 * not a second source of them. Navigate-only, no content search: this is
 * a portfolio, not a docs site.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((item) => itemLabel(item).toLowerCase().includes(q));
  }, [query]);

  function onQueryChange(value: string) {
    setQuery(value);
    setSelected(0);
  }

  function close() {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }

  function activate(item: Item) {
    if (item.kind === "scene") {
      goToScene(item.scene);
    } else if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = item.href;
    }
    close();
  }

  // Global trigger: ⌘K / Ctrl+K toggles, the header button dispatches the
  // same open, Escape always closes.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") close();
    }
    function onOpenEvent() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function onListKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && filtered[selected]) {
      e.preventDefault();
      activate(filtered[selected]);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Command palette">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FAST}
            onClick={close}
            aria-hidden="true"
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={FAST}
            className="relative mx-auto mt-[14vh] w-[min(32rem,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-border bg-background/95 shadow-[0_24px_60px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <span aria-hidden="true" className="font-mono text-[11px] text-muted-2">
                ⌘K
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={onListKeyDown}
                placeholder="Jump to…"
                aria-label="Filter destinations"
                className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-2 focus:outline-none"
              />
              <span className="font-mono text-[10px] tracking-[0.1em] text-muted-2">ESC</span>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center font-mono text-[11px] text-muted-2">No match.</li>
              ) : (
                filtered.map((item, i) => (
                  <li key={itemLabel(item) + itemTag(item)}>
                    <button
                      type="button"
                      onClick={() => activate(item)}
                      onMouseEnter={() => setSelected(i)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-mono text-[13px] transition-colors duration-150",
                        i === selected ? "bg-accent-soft text-foreground" : "text-muted hover:text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-7 text-[10px] tracking-[0.08em] text-muted-2">{itemTag(item)}</span>
                        {itemLabel(item)}
                      </span>
                      {item.kind === "link" && item.external ? (
                        <ArrowUpRight className="size-3.5 text-muted-2" />
                      ) : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
