import { Platform } from "@/app/(app)/dashboard/page";

const PLATFORMS: Platform[] = ["linkedin"];

export function PlatformSwitcher({
  active,
  onChange,
}: {
  active: Platform;
  onChange: (p: Platform) => void;
}) {
  return (
    <section className="flex gap-2 overflow-x-auto">
      {PLATFORMS.map((platform) => (
        <button
          key={platform}
          onClick={() => onChange(platform)}
          className={`px-4 py-2 rounded-md text-sm font-medium border
            ${
              active === platform
                ? "bg-[var(--color-primary-500)] text-white border-transparent"
                : "bg-[var(--color-surface)] border-[var(--color-border)]"
            }`}
        >
          {platform.toUpperCase()}
        </button>
      ))}
    </section>
  );
}
