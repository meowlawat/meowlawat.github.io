import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { research } from "@/data/research";
import { experience } from "@/data/experience";
import { cn } from "@/lib/utils";

const IDENTITY = [
  {
    label: "Security",
    fact: "Pentest · TEE · vuln research",
    detail: `Findings at ${experience[1]?.org ?? "independent research"}; CVSS risk work at ${experience[0]?.org ?? "current role"}.`,
  },
  {
    label: "Systems",
    fact: "Air-gapped · autonomous",
    detail: "Network simulation through prediction to recovery, offline end to end.",
  },
  {
    label: "Machine Learning",
    fact: "Sequence models",
    detail: "LSTM autoencoders, password-guessing evaluation, intrusion detection.",
  },
  {
    label: "Research",
    fact: `${research.length} entries`,
    detail: "Trusted execution, metering integrity, memory-hard password security.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="border-b border-border py-24 sm:py-32">
      <Container>
        <SectionHeader index="09" label="ABOUT" title="About" />

        <Reveal>
          <p className="max-w-2xl text-balance text-lg leading-relaxed text-foreground/90">
            {site.tagline}
          </p>
        </Reveal>

        <div className="mt-16 flex flex-wrap items-baseline gap-x-8 gap-y-10 sm:gap-x-12">
          {IDENTITY.map((block, i) => (
            <Reveal key={block.label} delay={i * 0.07}>
              <div
                className={cn(
                  "relative",
                  i % 2 === 1 ? "sm:translate-y-6" : "sm:-translate-y-2",
                )}
              >
                <span className="absolute -top-5 left-0 font-mono text-[10px] tracking-[0.1em] text-accent">
                  {block.fact}
                </span>
                <span className="font-display block text-[clamp(1.75rem,5.5vw,3.5rem)] leading-none font-semibold tracking-tight text-foreground uppercase">
                  {block.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-x-10 gap-y-2 border-t border-border pt-8 font-mono text-xs text-muted">
          {IDENTITY.map((block) => (
            <span key={block.label} className="max-w-[16rem]">
              {block.detail}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
