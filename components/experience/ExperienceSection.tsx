import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { experience } from "@/data/experience";
import { cn } from "@/lib/utils";

export function ExperienceSection() {
  return (
    <section id="experience" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeader index="05" label="EXPERIENCE" title="Experience" />

        <ol className="relative flex flex-col gap-10 pl-8 sm:gap-12 sm:pl-10">
          <div
            className="absolute top-2 bottom-2 left-[5px] w-px bg-border-strong sm:left-[7px]"
            aria-hidden="true"
          />

          {experience.map((item, i) => (
            <Reveal key={item.org} as="li" delay={i * 0.06} className="relative">
              <span
                className={cn(
                  "absolute top-1.5 -left-8 flex size-2.5 -translate-x-1/2 items-center justify-center rounded-full sm:-left-10",
                  item.current ? "bg-verified" : "bg-accent",
                )}
                aria-hidden="true"
              >
                {item.current ? (
                  <span className="node-pulse absolute inline-flex size-full rounded-full bg-verified opacity-60 motion-reduce:hidden" />
                ) : null}
              </span>

              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-muted-2">
                    {item.period}
                  </span>
                  {item.current ? (
                    <span className="font-mono text-[10px] tracking-[0.14em] text-verified">
                      LIVE
                    </span>
                  ) : null}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.role}
                </h3>
                <p className="text-sm text-muted">
                  {item.org} — {item.location}
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  {item.summary}
                </p>
                <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm text-foreground/85 sm:grid-cols-2">
                  {item.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-2" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
