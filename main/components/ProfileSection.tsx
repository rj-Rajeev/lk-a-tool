"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GeneratePost from "@/components/settings/GeneratePost";
import AutomationScheduleModal from "./AutomationScheduleModal";

type User = {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
};

type ProfileSectionProps = {
  user: User;
  provider?: "linkedin"; // future-proof
};

export default function ProfileSection({
  user,
  provider = "linkedin",
}: ProfileSectionProps) {
  const router = useRouter();
  const [automationOpen, setAutomationOpen] = useState(false);

  return (
    <>
      <div className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        {/* LEFT: Profile Info */}
        <div className="flex items-center gap-4">
          <img
            src={user.picture || ""}
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover border border-border"
          />

          <div className="min-w-0">
            <h3 className="font-semibold leading-tight truncate">
              {user.name || "Unnamed User"}
            </h3>

            <p className="text-sm text-text-secondary truncate">
              {user.email || "No email"}
            </p>

            <p className="text-xs text-green-600 mt-1">
              {provider === "linkedin" && "LinkedIn connected ✓"}
            </p>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex flex-wrap gap-2 justify-start md:justify-end">

          {/* Primary action */}
          <GeneratePost />

          {/* Secondary navigation */}
          <button
            onClick={() => router.push(`/profile/${provider}/draft`)}
            className="btn-secondary"
          >
            Drafts
          </button>

          <button
            onClick={() => router.push(`/profile/${provider}/schedule`)}
            className="btn-secondary"
          >
            Scheduled
          </button>

          <button
            onClick={() => router.push(`/profile/${provider}/published`)}
            className="btn-secondary"
          >
            Published
          </button>

          {/* Automation */}
          <button
            onClick={() => setAutomationOpen(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            Automation
          </button>
        </div>
      </div>

      {/* AUTOMATION MODAL */}
      {automationOpen && (
        <AutomationScheduleModal
          provider={provider}
          onClose={() => setAutomationOpen(false)}
        />
      )}
    </>
  );
}
