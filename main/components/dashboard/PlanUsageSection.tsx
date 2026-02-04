export function PlanUsageSection() {
  return (
    <section className="card">
      <h2 className="font-semibold mb-4">Current Plan Usage</h2>

      <div className="space-y-4">
        <UsageRow
          label="Posts"
          value="18 / 30"
          progress={60}
        />

        <UsageRow
          label="Tokens"
          value="4,200 / 10,000"
          progress={42}
        />

        <p className="text-sm text-[var(--color-text-muted)]">
          Billing cycle resets in 12 days
        </p>
      </div>
    </section>
  );
}

function UsageRow({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="label">{label}</span>
        <span className="font-medium">{value}</span>
      </div>

      <div className="h-1.5 rounded bg-[var(--color-surface-2)] overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary-500)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
