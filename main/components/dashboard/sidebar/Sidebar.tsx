"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "./sidebar.config";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        hidden md:flex
        w-64
        flex-shrink-0
        bg-[var(--color-surface)]
        border-r border-[var(--color-border)]
        sticky top-20
        h-[calc(100vh-5rem)]
        flex-col
      "
    >
      {/* ───────────────── Brand / Context ───────────────── */}
      <div className="px-4 py-4 border-b border-[var(--color-border)]">
        <p className="font-semibold text-lg leading-none">Automation</p>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          LinkedIn AI
        </p>
      </div>

      {/* ───────────────── Primary Action ───────────────── */}
      <div className="px-4 py-4 border-b border-[var(--color-border)]">
        {sidebarItems
          .find((g) => g.section === "primary")
          ?.items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="
                flex items-center gap-3 px-3 py-2 rounded-md
                text-sm font-medium
                bg-[var(--color-primary-500)]
                text-white
                hover:bg-[var(--color-primary-600)]
                transition
              "
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
      </div>

      {/* ───────────────── Navigation (Scrollable) ───────────────── */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {sidebarItems
          .filter((g) => g.section !== "primary")
          .map((group) => (
            <div key={group.section} className="space-y-1">
              <p className="px-3 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)] mb-1">
                {group.section}
              </p>

              {group.items.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-md
                      text-sm font-medium transition
                      ${
                        active
                          ? "bg-[var(--color-surface-2)]"
                          : "hover:bg-[var(--color-surface-2)]"
                      }
                    `}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
      </nav>

      {/* ───────────────── System / Meta ───────────────── */}
      <div className="px-4 py-3 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
        v1.0 • ContentAIx
      </div>
    </aside>
  );
}
