import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center py-20">
      <Container className="flex flex-col items-start gap-4">
        <span className="font-mono text-xs tracking-[0.18em] text-muted-2">
          404
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="max-w-md text-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-2 text-sm font-medium text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-accent"
        >
          Back to home
        </Link>
      </Container>
    </section>
  );
}
