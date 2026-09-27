import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ExternalLink({
  href,
  children,
  className,
  showIcon = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  showIcon?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-1 text-foreground underline decoration-border-strong decoration-1 underline-offset-4 transition-colors hover:decoration-accent",
        className,
      )}
    >
      {children}
      {showIcon ? (
        <ArrowUpRight
          className="size-3.5 shrink-0 text-muted transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          aria-hidden="true"
        />
      ) : null}
    </a>
  );
}
