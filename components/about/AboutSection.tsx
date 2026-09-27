import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { research } from "@/data/research";
import { experience } from "@/data/experience";

const IDENTITY = [
  {
    label: "Security",
    fact: "Penetration testing, TEE isolation, vulnerability research",
    detail: `Documented findings from ${experience[1]?.org ?? "independent research"} and CVSS-based risk work at ${experience[0]?.org ?? "current role"}.`,
  },
  {
    label: "Systems",
    fact: "Air-gapped, autonomous, zero outbound dependency",
    detail: "Network simulation through prediction to recovery, built to run entirely offline.",
  },
  {
    label: "Machine Learning",
    fact: "LSTM autoencoders, sequence models, applied inference",
    detail: "Password-guessing evaluation, intrusion detection, and time-to-impact prediction.",
  },
  {
    label: "Research",
    fact: `${research.length} research entries`,
    detail: "Trusted execution environments, metering integrity, memory-hard password security.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeader index="09" label="ABOUT" title="About" />

        <Reveal>
          <p className="max-w-2xl text-balance text-lg leading-relaxed text-foreground/90">
            {site.tagline}
          </p>
        </Reveal>

        <div className="relative mt-14 grid gap-8 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute top-0 right-0 left-0 hidden h-px lg:block"
            aria-hidden="true"
          >
            <svg viewBox="0 0 100 1" preserveAspectRatio="none" className="h-px w-full">
              <line
                x1="0"
                y1="0.5"
                x2="100"
                y2="0.5"
                stroke="var(--border-strong)"
                strokeWidth="1"
                className="signal-connection"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {IDENTITY.map((block, i) => (
            <Reveal key={block.label} delay={i * 0.06}>
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-muted-2">
                  <span className="node-pulse size-1.5 rounded-full bg-accent" aria-hidden="true" />
                  {block.label.toUpperCase()}
                </span>
                <span className="text-base font-medium text-foreground">
                  {block.fact}
                </span>
                <p className="text-sm leading-relaxed text-muted">
                  {block.detail}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
