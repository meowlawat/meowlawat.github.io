import { SectionStatement } from "@/components/ui/SectionStatement";
import { Container } from "@/components/ui/Container";
import { ProjectFeature } from "@/components/projects/ProjectFeature";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="projects" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionStatement
          index="02 / SYSTEMS"
          label="FLAGSHIP PROJECT"
          lines={["One flagship", "system."]}
          description="A single project gets the full treatment: topology, fault, prediction, recovery — built end-to-end with zero outbound dependency."
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
