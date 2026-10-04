import { Container } from "@/components/ui/Container";
import { skills } from "@/data/skills";

// Confidence, not enumeration — real categories/items from data/skills.ts,
// no bars, no percentages, no icon grid.
export function Stack() {
  return (
    <section id="stack" className="border-t border-border py-20 sm:py-28">
      <Container>
        <p className="font-mono text-xs tracking-[0.14em] text-muted-2 uppercase">Stack</p>
        <div className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-10">
          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="font-mono text-[11px] tracking-[0.1em] text-foreground uppercase">
                {group.category}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{group.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
