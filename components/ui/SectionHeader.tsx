import { Reveal } from "@/components/ui/Reveal";

export function SectionHeader({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal>
      <div className="mb-12 flex flex-col gap-3 sm:mb-16">
        <div className="flex items-center gap-3 font-mono text-xs tracking-[0.18em] text-muted-2">
          <span>{index}</span>
          <span className="h-px w-8 bg-border-strong" aria-hidden="true" />
          <span>{label}</span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-balance text-sm leading-relaxed text-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}
