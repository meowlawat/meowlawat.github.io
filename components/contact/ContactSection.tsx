import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { site } from "@/data/site";

export function ContactSection() {
  return (
    <section id="contact" className="py-28 sm:py-36">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-6">
            <span className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted-2">
              <span className="size-1.5 rounded-full bg-muted-2" aria-hidden="true" />
              SIGNAL / AWAITING CONNECTION
            </span>
            <span className="font-mono text-xs tracking-[0.18em] text-muted-2">
              10 / CONTACT
            </span>
            <h2 className="max-w-3xl text-[clamp(2rem,4vw+0.5rem,3.75rem)] leading-[1.02] font-semibold text-balance tracking-tight text-foreground">
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

        <div className="mt-16 flex items-center justify-between border-t border-border pt-6 font-mono text-[11px] tracking-[0.1em] text-muted-2">
          <span>{site.location}</span>
          <span>10 / 10</span>
        </div>
      </Container>
    </section>
  );
}
