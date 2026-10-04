import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{site.name}</p>
          <p className="mt-1 text-xs text-muted-2">
            {site.location} · © {new Date().getFullYear()}
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm text-muted">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 ease-settle hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 ease-settle hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href={site.orcid}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 ease-settle hover:text-foreground"
          >
            ORCID
          </a>
        </div>

        <p className="text-xs text-muted-2">Always interested in interesting problems.</p>
      </Container>
    </footer>
  );
}
