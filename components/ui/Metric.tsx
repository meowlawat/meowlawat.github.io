import type { Metric as MetricType } from "@/lib/types";

export function Metric({ label, value, context }: MetricType) {
  return (
    <div className="flex flex-col gap-1 border-l border-border pl-3">
      <span className="font-mono text-xl font-medium tabular-nums text-foreground sm:text-2xl">
        {value}
      </span>
      <span className="text-xs leading-snug text-muted">
        {label}
        {context ? (
          <span className="block text-muted-2">{context}</span>
        ) : null}
      </span>
    </div>
  );
}

export function MetricGrid({ metrics }: { metrics: MetricType[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
      {metrics.map((m) => (
        <Metric key={m.label} {...m} />
      ))}
    </div>
  );
}
