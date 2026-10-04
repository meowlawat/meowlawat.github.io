# Editorial homepage redesign

**Status:** Approved. **Date:** 2026-10-05.

## Intent

The current homepage (pinned scroll-driven "scenes": RDS, MPLS, Findings,
Identity, Experience, Contact — ~2400vh of scroll track) reads as an
interactive cybersecurity visualization demo. The owner wants it to read as
"an exceptional designer/developer/researcher's personal website" instead:
minimal, editorial, confident enough to leave things out. Design-language
reference: https://www.akshatsingh.site/ — typography scale, whitespace,
restraint, information density, interaction philosophy, and navigation
simplicity are the things being borrowed. Its text, project content,
personal information, code, assets, and branding are explicitly **not**
being reproduced; all content stays the owner's own, drawn only from the
existing `data/*.ts` files.

Success: a visitor can scroll the whole homepage in under a minute, reach
Work/About/Contact in one click each from anywhere, and the page communicates
who-what-where-currently without reading a paragraph. Detail pages
(research/project) are untouched — the homepage is the curated entrance,
detail pages are where technical depth lives.

## Visual language

- **Color** (homepage only): `--background #080a0d`, `--foreground #eeeae1`,
  `--muted #9c9a92`, `--muted-2 #86847d` (all existing tokens, unchanged),
  one accent — `--accent #b47767` (the existing "rust" token; warm, muted,
  not dark). Teal/sage/cobalt-as-accent retire from the homepage. Detail
  pages keep the fuller palette — those colors are functional state markers
  in `NetworkDiagram`/architecture nodes there, not decorative, and are out
  of scope for this change.
- **Typography** — Space Grotesk (display/name), Geist Sans (body), Geist
  Mono (metadata/dates). Four-step scale: hero name (largest single element
  on the page) → section intros → body → small-caps mono metadata. No
  per-scene bespoke sizing.
- **Motion** — `lib/motion.ts`'s FAST/MEDIUM/SLOW tiers stay (critically
  damped springs, no bounce) for hover/focus micro-interactions only: text
  displacement, arrow movement, opacity, a subtle image/visual reveal on
  project hover. No scroll-scrubbing, no pinned stages, no state machines
  tied to scroll position. `lib/scroll.ts` (`useSceneProgress`, `useBand`,
  `smoothSteps`, the scroll-follow spring configs) is deleted — nothing
  scroll-scrubs anymore.
- **Density** — curate, don't enumerate. Four work items, not the full
  research+project+findings+experiments catalog. No cards, borders, boxes,
  glass, gradients, metric panels, skill bars, or dashboard layouts.

## Structure

`app/page.tsx` becomes five plain `<section>`s in normal document flow,
generous vertical padding (no `h-[Nvh]` scroll tracks, no `position: sticky`
pinning):

1. **Hero** — name, one-line role, a short "currently" line sourced from
   `experience.find(e => e.current)`, location, two restrained links ("View
   work ↗", "Get in touch ↗" — plain text links, not buttons). Quiet
   background (soft gradient wash, no topology graphic, no nodes, no SVG
   network).
2. **Selected Work** — editorial numbered list, four items, generous
   spacing, hover shifts title/reveals arrow/year (restrained — opacity and
   small transform only). Each links to its existing detail route:
   1. Runtime Data Shadowing → `research[runtime-data-shadowing]`
   2. MPLS Predictive Copilot → `projects[mpls-predictive-copilot]`
   3. Evaluating LSTM-Based Password Guessing → `research[lstm-password-guessing-argon2id]`
   4. Token-Accounting Integrity in LLM Metering → `research[token-accounting-integrity-llm-metering]`
   Status shown as tiny metadata ("2026 · Accepted · Springer/Scopus"), not
   a badge.
3. **Stack** — `data/skills.ts`'s three categories (Security & Systems /
   AI·ML·Data / Engineering), compact inline lists, no bars/percentages/icons.
4. **About** — short first-person paragraph from `data/education.ts` +
   `data/experience.ts` facts (IIT Patna B.Sc. CS & Data Analytics,
   dual-enrolled with VIPS B.Tech CSE–Cybersecurity; current role). No
   résumé-paragraph tone, no invented personality traits.
5. **Contact** — "Let's work together." + one line + Email/GitHub/LinkedIn/
   ORCID as plain links. No Resume link (no resume file exists in the repo;
   owner chose to omit rather than link something nonexistent). Visible and
   reachable immediately — a normal section, not a scroll-gated scene.

**Navigation** — `Hardik Ahlawat` / `Work` `About` `Contact`, plain in-page
anchors with native smooth scroll. No scene index, no landing-point math,
no `landAt` offsets. The ⌘K command palette and its header hint stay
(restrained, useful, not asked to be removed) — restyled to the new single-
accent palette, pointing at the new section ids.

**Footer** — `Hardik Ahlawat` / location / © year / GitHub · LinkedIn ·
ORCID / "Always interested in interesting problems." (replaces the more
direct "Available for research / engineering opportunities" — owner wanted
something subtler, not a job-ad line).

## File plan

**Deleted** (verified via grep that nothing outside `app/page.tsx` and each
other imports them):
`components/hero/Hero.tsx`, `components/hero/HeroTopology.tsx`,
`components/scenes/RDSScene.tsx`, `MPLSScene.tsx`, `FindingsScene.tsx`,
`IdentityScene.tsx`, `ExperienceScene.tsx`, `ContactScene.tsx`,
`ResearchExperiments.tsx`, `SceneGraph.tsx`, `CaptionReel.tsx`,
`SignalThread.tsx`, `lib/scroll.ts`.

**New**: `components/home/Hero.tsx`, `SelectedWork.tsx`, `Stack.tsx`,
`About.tsx`, `Contact.tsx` (one file per section, each owning its own data
mapping — no shared "scene" abstraction since there's no shared scroll
machinery to coordinate).

**Edited**: `app/page.tsx` (new five-section composition),
`components/navigation/Navigation.tsx` (plain anchors, no `landAt`/`jumpTo`,
restyle to single accent), `components/navigation/CommandPalette.tsx`
(restyle only — same scenes-as-destinations model, now pointing at the 5
new section ids instead of the old scene ids), `components/navigation/Footer.tsx`
(new copy line), `lib/nav.ts` (drop the scroll-jump logic, keep a plain
id→label list for the palette/nav to share), `lib/motion.ts` (drop
`SCROLL_FOLLOW`/`SCROLL_DIRECT`, keep FAST/MEDIUM/SLOW), `app/globals.css`
(homepage accent token change; detail-page tokens unchanged).

**Untouched**: every `data/*.ts` file, `lib/types.ts`, `app/research/[slug]/page.tsx`,
`app/projects/[slug]/page.tsx`, `components/architecture/NetworkDiagram.tsx`,
`components/ui/*`, SEO (`sitemap.ts`, `robots.ts`, metadata in `layout.tsx`),
static export config, GitHub Pages deploy workflow.

## Testing

`npm run build`, `npx tsc --noEmit`, `npx eslint .`. Real headless-browser
screenshots at 390/768/1280/1440/1920: normal scroll, fast scroll, reverse
scroll, nav-link jumps to Work/About/Contact, mobile nav, keyboard nav,
hover interactions on the Work list and nav. No horizontal overflow at any
width. Confirm both detail-page routes still build and render.
