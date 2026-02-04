import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/layout/Footer";
import { Sidebar } from "@/components/dashboard/sidebar/Sidebar";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ContentAIx – AI LinkedIn Content Automation",
    template: "%s | ContentAIx",
  },
  description:
    "Create, schedule, and auto-publish LinkedIn posts using AI. Built for creators, founders, and professionals.",
  keywords: [
    "LinkedIn automation",
    "AI content",
    "LinkedIn scheduler",
    "personal branding",
    "ContentAIx",
  ],
  authors: [{ name: "ContentAIx Team" }],
  metadataBase: new URL("https://contentaix.vercel.app"),
  openGraph: {
    title: "ContentAIx – AI LinkedIn Content Automation",
    description:
      "Automate LinkedIn content creation, scheduling, and publishing with AI.",
    url: "https://contentaix.vercel.app",
    siteName: "ContentAIx",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ContentAIx – AI LinkedIn Automation",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ContentAIx – AI LinkedIn Content Automation",
    description:
      "Create, schedule, and auto-publish LinkedIn posts using AI.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased bg-[var(--color-bg)]">
        {/* APP SHELL */}
        <div className="flex min-h-screen flex-col">
          {/* Header */}
          <Header />

          {/* App content area */}
          <div className="relative flex flex-1">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="flex-1 mt-20 px-4 py-6">
              {children}
            </main>
          </div>
        </div>

        {/* Footer (OUTSIDE APP SHELL) */}
        <Footer />
      </body>
    </html>
  );
}
