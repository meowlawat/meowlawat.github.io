import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/data/site";

const CONTACT_LINKS = [
  { href: `mailto:${site.email}`, label: "Email", external: false },
  { href: site.github, label: "GitHub", external: true },
  { href: site.linkedin, label: "LinkedIn", external: true },
  { href: site.orcid, label: "ORCID", external: true },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-28 sm:py-36">
      <Container>
        {/* Resolution: the network settles — a row of signals fading out,
            one final verified node remains. */}
        <div className="mb-10 flex items-center gap-2" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="h-px flex-1 bg-accent"
              style={{ opacity: 0.5 - i * 0.06 }}
            />
          ))}
          <span className="node-pulse size-2 shrink-0 rounded-full bg-verified" />
        </div>

        <Reveal>
          <div className="flex flex-col items-start gap-6">
            <span className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-muted-2">
              <span className="size-1.5 rounded-full bg-muted-2" aria-hidden="true" />
              SIGNAL / AWAITING CONNECTION
            </span>
            <h2 className="font-display max-w-3xl text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-semibold text-balance tracking-tight text-foreground uppercase">
              Let&rsquo;s build something difficult.
            </h2>
            <p className="max-w-xl text-balance text-muted">
              Research, security, systems, or interesting engineering
              problems.
            </p>

            <nav className="mt-4 flex flex-col gap-1.5">
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-3 font-mono text-sm text-muted transition-colors duration-150 hover:text-foreground"
                >
                  <span className="uppercase tracking-wide">{link.label}</span>
                  <ArrowUpRight className="size-4 text-accent transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </nav>
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
