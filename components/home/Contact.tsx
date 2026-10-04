import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";

const LINKS = [
  { label: "Email", href: `mailto:${site.email}`, external: false },
  { label: "GitHub", href: site.github, external: true },
  { label: "LinkedIn", href: site.linkedin, external: true },
  { label: "ORCID", href: site.orcid, external: true },
];

// A normal section, not a scroll-gated scene — reachable in one click from
// the header, visible and usable the instant you arrive. No waiting.
export function Contact() {
  return (
    <section id="contact" className="border-t border-border py-24 sm:py-32">
      <Container>
        <h2 className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] font-bold tracking-tight text-foreground">
          Let&rsquo;s work together.
        </h2>
        <p className="mt-4 max-w-md text-base text-muted sm:text-lg">
          Open to research, security engineering and interesting systems problems.
        </p>
        <nav aria-label="Contact" className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-1.5 text-base text-foreground transition-colors duration-300 ease-settle hover:text-home-accent"
            >
              {l.label}
              <ArrowUpRight className="size-4 transition-transform duration-300 ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ))}
        </nav>
      </Container>
    </section>
  );
}
