import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { findings } from "@/data/findings";

/**
 * The one orange section on the site. Warm orange is reserved exclusively
 * for security findings — it never appears as decoration elsewhere.
 */
export function SecurityFindingsSection() {
  return (
    <section
      id="findings"
      className="border-b border-alert-border bg-alert-soft py-16 sm:py-20"
    >
      <Container>
        <SectionHeader
          index="03"
          label="SECURITY FINDINGS"
          title="Field Notes"
          description="Vulnerability research and security findings, documented as short technical notes."
        />

        <ol className="flex flex-col divide-y divide-alert-border border-t border-alert-border">
          {findings.map((finding, i) => (
            <Reveal key={finding.id} as="li" delay={i * 0.06}>
              <div className="flex flex-col gap-1.5 py-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-alert">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <span className="text-base font-medium text-foreground">
                    {finding.title}
                  </span>
                </div>
                <p className="max-w-2xl pl-9 text-sm leading-relaxed text-muted">
                  {finding.description}
                </p>
                <span className="pl-9 font-mono text-xs text-muted-2">
                  {finding.source}
                  {finding.year ? ` · ${finding.year}` : ""}
                  {finding.status ? ` · ${finding.status}` : ""}
                </span>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
