export function PlanUsageOverview() {
  return (
    <div className="card">
      <h2 className="font-semibold mb-4">Current Plan Usage</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <UsageStat
          label="Posts Used"
          value="18 / 30"
          progress={60}
        />
        <UsageStat
          label="Tokens Used"
          value="4,200 / 10,000"
          progress={42}
        />
        <UsageStat
          label="Billing Cycle"
          value="Resets in 12 days"
        />
      </div>
    </div>
  );
}

function UsageStat({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress?: number;
}) {
  return (
    <div>
      <p className="label mb-1">{label}</p>
      <p className="font-semibold text-lg">{value}</p>

      {progress !== undefined && (
        <div className="mt-2 h-1 rounded bg-[var(--color-surface-2)] overflow-hidden">
          <div
            className="h-full bg-[var(--color-primary-500)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
