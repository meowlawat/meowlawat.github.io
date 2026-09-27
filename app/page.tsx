import { Hero } from "@/components/hero/Hero";
import { ResearchSection } from "@/components/research/ResearchSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { GitHubSection } from "@/components/github/GitHubSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { EducationSection } from "@/components/education/EducationSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { AchievementsSection } from "@/components/achievements/AchievementsSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ContactSection } from "@/components/contact/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <ResearchSection />
      <ProjectsSection />
      <GitHubSection />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <AchievementsSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
