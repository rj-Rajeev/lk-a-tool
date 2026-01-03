"use client";

import { LinkedInSettingsForm } from "@/components/LinkedInSettingsForm";
import GeneratePost from "@/components/settings/GeneratePost";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  sub?: string | null;
  name?: string | null;
  email?: string | null;
  picture?: string | null;
};

export default function LinkedInSettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setUser(data || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-sm text-text-secondary">Loading profile…</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-sm text-red-500">
          {error || "No profile available"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold">LinkedIn Automation</h1>
          <p className="text-sm text-text-secondary">
            Manage your profile, drafts, schedules, and automation preferences
          </p>
        </div>

        {/* Profile + Actions Card */}
        <div className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* Profile Info */}
          <div className="flex items-center gap-4">
            <img
              src={user.picture || ""}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border border-border"
            />

            <div>
              <h3 className="font-semibold leading-tight">
                {user.name || "Unnamed User"}
              </h3>
              <p className="text-sm text-text-secondary">
                {user.email || "No email"}
              </p>
              <p className="text-xs text-green-600 mt-1">
                LinkedIn connected ✓
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 justify-start md:justify-end">
            <GeneratePost />

            <button
              onClick={() => router.push("/profile/linkedin/draft")}
              className="btn-secondary"
            >
              View Drafts
            </button>

            <button
              onClick={() => router.push("/profile/linkedin/schedule")}
              className="btn-secondary"
            >
              Scheduled Posts
            </button>

            <button
              onClick={() => alert("Coming soon")}
              className="btn-secondary"
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="card">
          <LinkedInSettingsForm />
        </div>
      </div>
    </div>
  );
}
