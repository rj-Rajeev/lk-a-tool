import { ReactNode } from "react";

export function GraphCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
}
