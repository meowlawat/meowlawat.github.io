import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { experience } from "@/data/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeader index="04" label="EXPERIENCE" title="Experience" />

        <ol className="flex flex-col">
          {experience.map((item, i) => (
            <Reveal key={item.org} as="li" delay={i * 0.06}>
              <div className="grid gap-2 border-t border-border py-8 first:border-t-0 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-8">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {item.current ? (
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
                      </span>
                    ) : null}
                    <span className="font-mono text-xs text-muted-2">
                      {item.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{item.location}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.role}
                  </h3>
                  <p className="text-sm text-muted">{item.org}</p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                    {item.summary}
                  </p>
                  <ul className="mt-4 grid gap-x-6 gap-y-1.5 text-sm text-foreground/85 sm:grid-cols-2">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-2" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
