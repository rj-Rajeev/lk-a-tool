"use client";

import { GraphCard } from "./GraphCard";

const data = [1, 2, 1, 3, 2, 2, 4];

export function PostingFrequencyGraph() {
  const max = Math.max(...data);

  return (
    <GraphCard
      title="Posting Frequency"
      subtitle="Posts per day (last 7 days)"
    >
      <div className="flex items-end gap-2 h-40">
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-[var(--color-primary-300)]"
            style={{
              height: `${(v / max) * 100}%`,
            }}
          />
        ))}
      </div>
    </GraphCard>
  );
}
