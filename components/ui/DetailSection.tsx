import type { ReactNode } from "react";

export function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border py-8 first:border-t-0">
      <h2 className="font-mono text-xs tracking-[0.14em] text-muted-2">
        {title.toUpperCase()}
      </h2>
      <div className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/85 sm:text-base">
        {children}
      </div>
    </section>
  );
}
