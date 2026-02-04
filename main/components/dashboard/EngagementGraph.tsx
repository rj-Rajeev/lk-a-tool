"use client";

import { GraphCard } from "./GraphCard";

const data = [2.1, 2.4, 3.0, 3.6, 4.2, 4.0, 4.5];

export function EngagementGraph() {
  const max = Math.max(...data);

  return (
    <GraphCard
      title="Engagement Over Time"
      subtitle="Average engagement per post (%)"
    >
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="w-full h-40"
      >
        {/* grid line */}
        <line
          x1="0"
          y1="35"
          x2="100"
          y2="35"
          stroke="var(--color-border)"
          strokeDasharray="2 2"
        />

        {/* line */}
        <polyline
          fill="none"
          stroke="var(--color-primary-500)"
          strokeWidth="2"
          points={data
            .map(
              (v, i) =>
                `${(i / (data.length - 1)) * 100},${
                  35 - (v / max) * 30
                }`
            )
            .join(" ")}
        />

        {/* dots */}
        {data.map((v, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * 100}
            cy={35 - (v / max) * 30}
            r="1.5"
            fill="var(--color-primary-500)"
          />
        ))}
      </svg>
    </GraphCard>
  );
}
