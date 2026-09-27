import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { achievements } from "@/data/achievements";

export function AchievementsSection() {
  return (
    <section id="achievements" className="border-b border-border py-16 sm:py-20">
      <Container>
        <SectionHeader index="08" label="ACHIEVEMENTS" title="Achievements" />

        <ul className="flex flex-col divide-y divide-border border-t border-border">
          {achievements.map((a, i) => (
            <Reveal key={a.title} as="li" delay={i * 0.05}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <span className="text-sm text-foreground/90">{a.title}</span>
                <span className="font-mono text-xs text-muted-2">
                  {[a.org, a.year].filter(Boolean).join(" · ")}
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
