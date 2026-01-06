"use client";

import { LinkedInSettingsForm } from "@/components/LinkedInSettingsForm";
import GeneratePost from "@/components/settings/GeneratePost";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileSection from "@/components/ProfileSection";

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
        <ProfileSection user={user} provider="linkedin" />

        {/* Automation Settings */}
        <div className="card">
          <LinkedInSettingsForm />
        </div>
      </div>
    </div>
  );
}
