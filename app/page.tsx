import { Hero } from "@/components/hero/Hero";
import { ResearchSection } from "@/components/research/ResearchSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { SecurityFindingsSection } from "@/components/findings/SecurityFindingsSection";
import { GitHubSection } from "@/components/github/GitHubSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { EducationSection } from "@/components/education/EducationSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { AchievementsSection } from "@/components/achievements/AchievementsSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { ScrollFade } from "@/components/ui/ScrollFade";

export default function Home() {
  return (
    <>
      <Hero />
      <ScrollFade>
        <ResearchSection />
      </ScrollFade>
      <ScrollFade>
        <ProjectsSection />
      </ScrollFade>
      <ScrollFade>
        <SecurityFindingsSection />
      </ScrollFade>
      <ScrollFade>
        <GitHubSection />
      </ScrollFade>
      <ScrollFade>
        <ExperienceSection />
      </ScrollFade>
      <ScrollFade>
        <EducationSection />
      </ScrollFade>
      <ScrollFade>
        <SkillsSection />
      </ScrollFade>
      <ScrollFade>
        <AchievementsSection />
      </ScrollFade>
      <ScrollFade>
        <AboutSection />
      </ScrollFade>
      <ScrollFade exitFade={false}>
        <ContactSection />
      </ScrollFade>
    </>
  );
}
