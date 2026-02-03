"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  picture?: string;
};

export default function Navbar({
  user,
  provider,
}: {
  user: User | null;
  provider: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[var(--color-surface)]/95 border-b border-[var(--color-border)]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/icon.png" className="h-9 w-auto" />
              <span className="font-display text-xl">
                ContentAI<span className="text-[var(--color-primary-500)]">x</span>
              </span>
            </Link>

            {user && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-600 font-medium">
                {provider}
              </span>
            )}
          </div>

          {/* DESKTOP RIGHT */}
          {!user ? (
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#how-it-works">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="/api/linkedin/auth" className="btn-primary">
                Continue with LinkedIn
              </a>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/profile/linkedin">Dashboard</Link>
              <Link href="/profile/linkedin/draft">Drafts</Link>
              <Link href="/profile/linkedin/schedule">Schedule</Link>
              <Link href="/profile/linkedin/published">Published</Link>

              <div className="flex items-center gap-3">
                {user.picture && (
                  <img
                    src={user.picture}
                    className="w-8 h-8 rounded-full border"
                  />
                )}
                <form action="/api/logout" method="post">
                  <button className="text-text-muted hover:text-text-primary">
                    Logout
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t bg-[var(--color-surface)]"
          >
            <div className="px-6 py-6 space-y-4 text-sm">
              {!user ? (
                <>
                  <a href="#how-it-works">How it works</a>
                  <a href="#pricing">Pricing</a>
                  <a href="/api/linkedin/auth" className="btn-primary block">
                    Continue with LinkedIn
                  </a>
                </>
              ) : (
                <>
                  <Link href="/profile/linkedin">Dashboard</Link>
                  <Link href="/profile/linkedin/draft">Drafts</Link>
                  <Link href="/profile/linkedin/schedule">Schedule</Link>
                  <Link href="/profile/linkedin/published">Published</Link>
                  <form action="/api/logout" method="post">
                    <button className="text-left w-full">Logout</button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
