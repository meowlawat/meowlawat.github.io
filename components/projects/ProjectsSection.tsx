import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { ProjectFeature } from "@/components/projects/ProjectFeature";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="projects" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeader
          index="02"
          label="FLAGSHIP PROJECT"
          title="Systems"
          description="An autonomous system built end-to-end: simulation, telemetry, prediction, and recovery — with zero outbound dependency."
        />
        <div>
          {featured.map((project, i) => (
            <ProjectFeature
              key={project.slug}
              project={project}
              flagship={i === 0}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
