import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { findings } from "@/data/findings";
import { cn } from "@/lib/utils";

/**
 * The one orange section on the site. Warm orange is reserved exclusively
 * for security findings — it never appears as decoration elsewhere.
 * Rendered as scattered field-note fragments, not a divided list.
 */
export function SecurityFindingsSection() {
  return (
    <section
      id="findings"
      className="border-b border-alert-border bg-alert-soft py-20 sm:py-28"
    >
      <Container>
        <SectionHeader
          index="03"
          label="SECURITY FINDINGS"
          title="Field Notes"
          description="Vulnerability research and security findings, documented as short technical notes."
        />

        <div className="flex flex-col gap-14 sm:gap-20">
          {findings.map((finding, i) => (
            <Reveal key={finding.id} delay={i * 0.08}>
              <div
                className={cn(
                  "flex flex-col gap-3 sm:max-w-xl",
                  i % 2 === 1 ? "sm:ml-auto sm:items-end sm:text-right" : "",
                )}
              >
                <span className="font-mono text-xs text-alert">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
                <h3 className="font-display text-[clamp(1.75rem,5vw,3rem)] leading-[0.95] font-semibold tracking-tight text-foreground uppercase">
                  {finding.fragment[0]}
                  <br />
                  <span className="text-alert">{finding.fragment[1]}</span>
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {finding.description}
                </p>
                <span className="font-mono text-xs text-muted-2">
                  {finding.source}
                  {finding.year ? ` · ${finding.year}` : ""}
                  {finding.status ? ` · ${finding.status}` : ""}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
