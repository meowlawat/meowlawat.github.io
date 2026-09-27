import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { research } from "@/data/research";
import { projects } from "@/data/projects";

const IDENTITY = [
  {
    role: "Researcher",
    fact: `${research.length} accepted publications`,
    detail: "Trusted execution environments, password security under memory-hard KDFs.",
  },
  {
    role: "Engineer",
    fact: "TEE / ML / network security",
    detail: "Intel SGX enclaves, LSTM autoencoders, intrusion detection pipelines.",
  },
  {
    role: "Builder",
    fact: `${projects.length} featured systems`,
    detail: "Air-gapped autonomous operations, edge-local intrusion detection.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeader index="08" label="ABOUT" title="About" />

        <Reveal>
          <p className="max-w-2xl text-balance text-lg leading-relaxed text-foreground/90">
            {site.tagline}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 border-t border-border pt-10 sm:grid-cols-3">
          {IDENTITY.map((block, i) => (
            <Reveal key={block.role} delay={i * 0.08}>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs tracking-[0.14em] text-muted-2">
                  {block.role.toUpperCase()}
                </span>
                <span className="text-lg font-medium text-foreground">
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
