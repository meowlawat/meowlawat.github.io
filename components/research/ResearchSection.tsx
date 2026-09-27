import { SectionStatement } from "@/components/ui/SectionStatement";
import { Container } from "@/components/ui/Container";
import { ResearchFeature } from "@/components/research/ResearchFeature";
import { ResearchNote } from "@/components/research/ResearchNote";
import { ResearchCard } from "@/components/research/ResearchCard";
import { research } from "@/data/research";

export function ResearchSection() {
  return (
    <section id="research" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionStatement
          index="01 / RESEARCH"
          label="RESEARCH"
          lines={["Research as", "an instrument."]}
          description="Experiments become architecture, measurements become visual objects, and publications become a record of systems under pressure."
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
