import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { ResearchFeature } from "@/components/research/ResearchFeature";
import { ResearchNote } from "@/components/research/ResearchNote";
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
        <div className="flex flex-col">
          {research.map((paper, i) => {
            if (paper.layout === "feature") {
              return <ResearchFeature key={paper.slug} research={paper} />;
            }
            if (paper.layout === "compact") {
              return <ResearchNote key={paper.slug} research={paper} />;
            }
            return <ResearchCard key={paper.slug} research={paper} index={i} />;
          })}
        </div>
      </Container>
    </section>
  );
}
