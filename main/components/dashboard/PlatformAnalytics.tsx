import { EngagementGraph } from "./EngagementGraph";
import { PostingFrequencyGraph } from "./PostingFrequencyGraph";

export function PlatformAnalytics({
  platform,
}: {
  platform: string;
}) {
  return (
    <section className="space-y-8">
      <EngagementGraph />
      <PostingFrequencyGraph />
    </section>
  );
}
