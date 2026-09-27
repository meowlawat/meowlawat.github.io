import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { site } from "@/data/site";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-6">
            <span className="font-mono text-xs tracking-[0.18em] text-muted-2">
              09 / CONTACT
            </span>
            <h2 className="max-w-2xl text-3xl font-semibold text-balance tracking-tight text-foreground sm:text-5xl">
              Let&rsquo;s build something difficult.
            </h2>
            <p className="max-w-xl text-balance text-muted">
              Research, security, systems, or interesting engineering
              problems.
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <MagneticButton href={`mailto:${site.email}`} variant="primary">
                Email
              </MagneticButton>
              <MagneticButton
                href={site.github}
                variant="secondary"
                external
              >
                GitHub
              </MagneticButton>
              <MagneticButton
                href={site.linkedin}
                variant="secondary"
                external
              >
                LinkedIn
              </MagneticButton>
              <MagneticButton href={site.orcid} variant="secondary" external>
                ORCID
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
