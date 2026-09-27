import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { education } from "@/data/education";

export function EducationSection() {
  return (
    <section id="education" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeader
          index="05"
          label="EDUCATION"
          title="Education"
          description="Dual enrollment across two accredited institutions, pursued concurrently since 2024."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {education.map((item, i) => (
            <Reveal key={item.institution} delay={i * 0.06}>
              <div className="flex h-full flex-col gap-3 rounded-xl border border-border bg-surface/40 p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong motion-reduce:hover:translate-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {item.institution}
                  </h3>
                  <p className="text-sm text-muted">
                    {item.degree} — {item.field}
                  </p>
                </div>
                <span className="font-mono text-xs text-muted-2">
                  {item.period}
                </span>
                {item.notes ? (
                  <ul className="mt-1 flex flex-col gap-1 text-sm text-foreground/85">
                    {item.notes.map((n) => (
                      <li key={n} className="flex items-start gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-2" />
                        {n}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
