import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { ResearchCard } from "@/components/research/ResearchCard";
import { research } from "@/data/research";

export function ResearchSection() {
  return (
    <section id="research" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeader
          index="01"
          label="RESEARCH"
          title="Research"
          description="Research at the intersection of cybersecurity, machine learning, and trusted systems."
        />
        <div className="flex flex-col gap-5">
          {research.map((paper, i) => (
            <ResearchCard key={paper.slug} research={paper} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
