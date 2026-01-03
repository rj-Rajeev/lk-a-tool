import Link from "next/link";
import { getAuth } from "@/lib/auth";

export default async function Header() {
  const user = await getAuth();
  const provider = "LinkedIn"; // hardcoded for now

  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LEFT: Logo + Provider */}
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold text-lg">
            ContenAIx<span className="text-primary-600">.</span>
          </Link>

          {user && (
            <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-600 font-medium">
              {provider}
            </span>
          )}
        </div>

        {/* RIGHT */}
        {!user ? (
          <div className="flex items-center gap-4">
            <Link
              href="#how-it-works"
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              How it works
            </Link>

            <a
              href="/api/linkedin/auth"
              className="btn-primary"
            >
              Continue with LinkedIn
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-5">

            {/* LinkedIn scoped nav */}
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link href="/profile/linkedin" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/profile/linkedin/draft" className="hover:underline">
                Drafts
              </Link>
              <Link href="/profile/linkedin/schedule" className="hover:underline">
                Schedule
              </Link>
              <Link href="/profile/linkedin/published" className="hover:underline">
                Published
              </Link>
            </nav>

            {/* User */}
            <div className="flex items-center gap-3">
              {user?.picture && (
                <img
                  src={user?.picture}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full border border-border"
                />
              )}

              <form action="/api/logout" method="post">
                <button className="text-sm text-text-muted hover:text-text-primary">
                  Logout
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
