import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { useFcmToken } from "@/hooks/useFcmToken";
import FcmBridge from "@/components/FcmBridge";

export default async function LandingPage() {
  const user = await getAuth();

  // ✅ USER ALREADY LOGGED IN
  if (user) {
    redirect("/profile/linkedin");
  }

  

  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="max-w-6xl mx-auto px-6 py-24 space-y-24">

        {/* HERO */}
        <section className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            ContenAIx helps you create and publish
            <br />
            LinkedIn content — consistently
          </h1>

          <p className="text-lg text-text-secondary">
            ContenAIx is an AI-powered content workflow built for professionals.
            Generate post ideas, write content, manage drafts, schedule publishing,
            and track what’s live — all from one clean dashboard.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="/api/linkedin/auth"
              className="btn-primary text-base px-6 py-3 inline-block"
            >
              Get started with LinkedIn
            </a>

            <a
              href="#how-it-works"
              className="btn-secondary text-base px-6 py-3 inline-block"
            >
              How ContenAIx works
            </a>
          </div>

          <p className="text-xs text-text-muted">
            Secure LinkedIn OAuth · No auto-posting · Full user control
          </p>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="space-y-10">
          <h2 className="text-2xl font-semibold">
            How ContenAIx works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-2">Generate</h3>
              <p className="text-sm text-text-secondary">
                Get AI-powered topic ideas and generate LinkedIn-ready posts
                based on real professional content patterns.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Edit & Draft</h3>
              <p className="text-sm text-text-secondary">
                Edit content, personalize your voice, and save drafts.
                Nothing is published without your approval.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Schedule</h3>
              <p className="text-sm text-text-secondary">
                Schedule posts with date, time, and timezone control.
                Reschedule or cancel anytime.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Publish & Track</h3>
              <p className="text-sm text-text-secondary">
                Publish instantly or automatically, and keep a clean
                history of published posts.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="space-y-10">
          <h2 className="text-2xl font-semibold">
            What you can do with ContenAIx
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-2">AI Content Generation</h3>
              <p className="text-sm text-text-secondary">
                Generate high-quality LinkedIn posts from curated topics
                using AI designed for professional audiences.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Draft Management</h3>
              <p className="text-sm text-text-secondary">
                Save, edit, delete, and organize drafts with clear
                status indicators: draft, scheduled, or published.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Scheduling System</h3>
              <p className="text-sm text-text-secondary">
                Plan posts ahead of time with timezone awareness
                and complete control over publishing.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Published History</h3>
              <p className="text-sm text-text-secondary">
                View all published LinkedIn posts in one place,
                with timestamps and direct platform links.
              </p>
            </div>
          </div>
        </section>

        {/* UPCOMING */}
        <section className="space-y-10">
          <h2 className="text-2xl font-semibold">
            What’s coming next
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-2">More Platforms</h3>
              <p className="text-sm text-text-secondary">
                Support for X (Twitter), Instagram, and YouTube —
                with platform-specific workflows.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-sm text-text-secondary">
                Track engagement metrics like likes, comments,
                and performance trends.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-2">Smarter Automation</h3>
              <p className="text-sm text-text-secondary">
                Suggested posting times, content reuse,
                and intelligent scheduling recommendations.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center space-y-6">
          <h2 className="text-3xl font-semibold">
            Start building your LinkedIn presence with ContenAIx
          </h2>

          <p className="text-text-secondary max-w-2xl mx-auto">
            ContenAIx is designed to help professionals stay consistent
            on LinkedIn without stress, guesswork, or accidental posting.
          </p>

          <a
            href="/api/linkedin/auth"
            className="btn-primary text-base px-8 py-3 inline-block"
          >
            Connect LinkedIn & Get Started
          </a>
        </section>

      </div>
    </div>
  );
}
