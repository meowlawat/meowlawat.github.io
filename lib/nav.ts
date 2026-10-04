// The site's navigation model: three plain sections, reachable from the
// header, the footer, and the command palette — all sharing this one list
// instead of each maintaining their own copy.

export interface SectionLink {
  id: string;
  label: string;
}

export const SECTIONS: SectionLink[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Every section is a normal in-flow block now — no pinned scroll track, no
// pointer-events gate, no "land past the resolve point" math. A plain
// scrollIntoView reaches fully-visible, fully-usable content immediately.
export function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: reducedMotion() ? "auto" : "smooth",
    block: "start",
  });
  window.history.pushState(null, "", `#${id}`);
}
