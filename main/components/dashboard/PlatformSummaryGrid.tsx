export function PlatformSummaryGrid({
  platform,
}: {
  platform: string;
}) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SummaryStat label="Posts Published" value="18" />
      <SummaryStat label="Avg Engagement" value="4.2%" />
      <SummaryStat label="Last Post" value="2 days ago" />
    </section>
  );
}

function SummaryStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="card text-center">
      <p className="label mb-1">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
