export function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] leading-none text-muted transition-colors hover:border-border-strong hover:text-foreground">
      {children}
    </span>
  );
}

export function TagRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </div>
  );
}
