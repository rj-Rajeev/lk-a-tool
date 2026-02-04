"use client";

import { useState } from "react";
import { PlanUsageSection } from "@/components/dashboard/PlanUsageSection";
import { PlatformSwitcher } from "@/components/dashboard/PlatformSwitcher";
import { PlatformSummaryGrid } from "@/components/dashboard/PlatformSummaryGrid";
import { PlatformAnalytics } from "@/components/dashboard/PlatformAnalytics";

export type Platform = "linkedin";

export default function DashboardPage() {
  const [platform, setPlatform] = useState<Platform>("linkedin");

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6 space-y-8">
      {/* SECTION 1 — GLOBAL */}
      <PlanUsageSection />

      {/* SECTION 2 — CONTROL */}
      <PlatformSwitcher active={platform} onChange={setPlatform} />

      {/* SECTION 3 — SUMMARY */}
      <PlatformSummaryGrid platform={platform} />

      {/* SECTION 4 — ANALYTICS */}
      <PlatformAnalytics platform={platform} />
    </div>
  );
}
