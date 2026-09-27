import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { TagRow } from "@/components/ui/Tag";
import { skills } from "@/data/skills";

export function SkillsSection() {
  return (
    <section id="skills" className="border-b border-border py-20 sm:py-28">
      <Container>
        <SectionHeader index="07" label="SKILLS" title="Skills" />

        <div className="grid gap-8 sm:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.category} delay={i * 0.06}>
              <div className="flex flex-col gap-4">
                <h3 className="font-mono text-xs tracking-[0.14em] text-muted-2">
                  {group.category.toUpperCase()}
                </h3>
                <TagRow items={group.items} />
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
