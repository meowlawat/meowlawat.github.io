import { Reveal } from "@/components/ui/Reveal";

/**
 * A large two-line editorial statement used to open Research and Systems
 * — the second line in the accent color. Distinct from SectionHeader
 * (which stays small/eyebrow-scale); this is meant to dominate.
 */
export function SectionStatement({
  index,
  label,
  lines,
  description,
}: {
  index: string;
  label: string;
  lines: [string, string];
  description?: string;
}) {
  return (
    <Reveal>
      <div className="mb-12 flex flex-col gap-4 sm:mb-16">
        <div className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-muted-2">
          <span>{index}</span>
          <span className="h-px w-8 bg-border-strong" aria-hidden="true" />
          <span>{label}</span>
        </div>
        <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1] font-bold tracking-tight text-foreground">
          <span className="block">{lines[0]}</span>
          <span className="block text-accent">{lines[1]}</span>
        </h2>
        {description ? (
          <p className="max-w-xl text-balance text-sm leading-relaxed text-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
