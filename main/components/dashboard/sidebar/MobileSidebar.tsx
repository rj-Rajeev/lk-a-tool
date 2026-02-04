"use client";

import { sidebarItems } from "./sidebar.config";
import Link from "next/link";
import { X } from "lucide-react";

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
      <aside className="absolute left-0 top-0 h-full w-72 bg-[var(--color-surface)] p-4 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <p className="font-semibold">Menu</p>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-4">
          {sidebarItems.map((group) =>
            group.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`
                  block px-3 py-2 rounded-md text-sm
                  ${
                    item.primary
                      ? "bg-[var(--color-primary-500)] text-white"
                      : "hover:bg-[var(--color-surface-2)]"
                  }
                `}
              >
                {item.label}
              </Link>
            ))
          )}
        </nav>
      </aside>
    </div>
  );
}
