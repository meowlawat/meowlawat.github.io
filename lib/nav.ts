// Shared navigation model: the five scenes and how to jump to them. Used by
// both the header's scene index (Navigation.tsx) and the command palette
// (CommandPalette.tsx) so there's one source of truth for "where can you go
// and what does arriving there correctly mean."

export interface SceneDestination {
  id: string;
  href: string;
  index: string;
  label: string;
  /** 0-1: where in the destination's own scroll track to land. Most scenes'
   * correct initial state *is* their top (a pinned narrative's deliberate
   * start). Contact is the exception — see jumpTo(). */
  landAt: number;
}

export const SCENES: SceneDestination[] = [
  { id: "research", href: "#research", index: "01", label: "Research", landAt: 0 },
  { id: "projects", href: "#projects", index: "02", label: "Systems", landAt: 0 },
  { id: "findings", href: "#findings", index: "03", label: "Findings", landAt: 0 },
  { id: "about", href: "#about", index: "04", label: "Identity", landAt: 0 },
  { id: "contact", href: "#contact", index: "05", label: "Contact", landAt: 0.64 },
];

// Scenes without their own index entry count toward the nearest one.
export const SECTION_TO_SCENE: Record<string, string> = {
  research: "#research",
  experiments: "#research",
  projects: "#projects",
  findings: "#findings",
  about: "#about",
  experience: "#about",
  contact: "#contact",
};

export function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// One jump for every destination: smooth in motion (respecting reduced
// motion), instant in intent — no scrolling through what's in between.
export function jumpTo(id: string, landAt: number, behavior: ScrollBehavior) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + el.offsetHeight * landAt, behavior });
}

export function goToScene(scene: SceneDestination) {
  jumpTo(scene.id, scene.landAt, reducedMotion() ? "auto" : "smooth");
  window.history.pushState(null, "", scene.href);
}
