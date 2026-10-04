// Shared navigation model: the five sections and how to jump to them. Used
// by both the header's index (Navigation.tsx) and the command palette
// (CommandPalette.tsx) so there's one source of truth for "where can you
// go." Nothing on the page is scroll-pinned anymore, so every destination's
// correct landing state is simply its top — no special-casing needed.

export interface SceneDestination {
  id: string;
  href: string;
  index: string;
  label: string;
}

export const SCENES: SceneDestination[] = [
  { id: "education", href: "#education", index: "01", label: "Education" },
  { id: "research", href: "#research", index: "02", label: "Research" },
  { id: "projects", href: "#projects", index: "03", label: "Systems" },
  { id: "about", href: "#about", index: "04", label: "Identity" },
  { id: "contact", href: "#contact", index: "05", label: "Contact" },
];

// Sections without their own index entry count toward the nearest one.
export const SECTION_TO_SCENE: Record<string, string> = {
  education: "#education",
  research: "#research",
  experiments: "#research",
  projects: "#projects",
  findings: "#about",
  about: "#about",
  experience: "#about",
  contact: "#contact",
};

export function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function jumpTo(id: string, behavior: ScrollBehavior) {
  document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
}

export function goToScene(scene: SceneDestination) {
  jumpTo(scene.id, reducedMotion() ? "auto" : "smooth");
  window.history.pushState(null, "", scene.href);
}
