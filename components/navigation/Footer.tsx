import { Container } from "@/components/ui/Container";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{site.name}</p>
          <p className="font-mono text-xs text-muted-2">
            Cybersecurity · Machine Learning · Systems
          </p>
        </div>

        <div className="flex items-center gap-5 text-sm text-muted">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href={site.orcid}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            ORCID
          </a>
        </div>

        <p className="font-mono text-xs text-muted-2">
          © {new Date().getFullYear()} {site.name}
        </p>
      </Container>
    </footer>
  );
}
