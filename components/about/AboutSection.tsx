import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

const PHILOSOPHY = ["Research", "Experiment", "Measure", "Build"];

export function AboutSection() {
  return (
    <section id="about" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeader index="08" label="ABOUT" title="About" />

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-foreground/90">
              {site.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-[0.14em] text-muted-2 lg:justify-end">
              {PHILOSOPHY.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  {step.toUpperCase()}
                  {i < PHILOSOPHY.length - 1 ? (
                    <span aria-hidden="true">→</span>
                  ) : null}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
