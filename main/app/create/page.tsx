"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Platform = "linkedin";
type PostType = "text" | "image" | "carousel" | "announcement";

export default function CreatePostPage() {
  const router = useRouter();

  /* ───────────────── State ───────────────── */
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [postType, setPostType] = useState<PostType | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  /* ───────────────── Step Logic ───────────────── */
  const computedStep =
    !platform ? 1 :
    !accountId ? 2 :
    !postType ? 3 :
    4;

  const [activeTab, setActiveTab] = useState<number>(computedStep);

  useEffect(() => {
    setActiveTab(computedStep);
  }, [computedStep]);

  /* ───────────────── Guards ───────────────── */
  const handlePlatformSelect = (p: Platform) => {
    const isConnected = true; // TODO: real platform check

    if (!isConnected) {
      router.push("/profile/linkedin");
      return;
    }

    setPlatform(p);
  };

  /* ───────────────── UI ───────────────── */
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

      {/* ───────── Header ───────── */}
      <div>
        <h1 className="text-xl font-semibold">Create Post</h1>
        <p className="text-sm text-text-secondary">
          Create and automate content in a few simple steps
        </p>
      </div>

      {/* ───────── Tabs ───────── */}
      <div className="sticky top-20 z-10 bg-[var(--color-bg)]">
        <div className="flex gap-2 overflow-x-auto border-b border-[var(--color-border)] pb-2">
          {[
            { id: 1, label: "Platform" },
            { id: 2, label: "Account" },
            { id: 3, label: "Type" },
            { id: 4, label: "Content" },
          ].map((tab) => {
            const enabled = computedStep >= tab.id;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                disabled={!enabled}
                onClick={() => enabled && setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap
                  transition
                  ${
                    active
                      ? "bg-[var(--color-primary-500)] text-white"
                      : enabled
                      ? "text-text-secondary hover:bg-[var(--color-surface-2)]"
                      : "text-text-muted cursor-not-allowed"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────── Tab 1: Platform ───────── */}
      {activeTab === 1 && (
        <section className="card space-y-3">
          <h2 className="font-medium">Choose platform</h2>

          <button
            onClick={() => handlePlatformSelect("linkedin")}
            className="w-full flex justify-between items-center px-4 py-3 rounded-md border hover:bg-[var(--color-surface-2)]"
          >
            <span>LinkedIn</span>
            <span className="text-xs text-green-600">Connected</span>
          </button>
        </section>
      )}

      {/* ───────── Tab 2: Account ───────── */}
      {activeTab === 2 && (
        <section className="card space-y-3">
          <h2 className="font-medium">Choose account</h2>

          {[
            { id: "personal", label: "Rajeev Bhardwaj" },
            { id: "company", label: "ContentAIx Page" },
          ].map((acc) => (
            <button
              key={acc.id}
              onClick={() => setAccountId(acc.id)}
              className={`
                w-full px-4 py-3 rounded-md border text-left
                hover:bg-[var(--color-surface-2)]
                ${
                  accountId === acc.id
                    ? "border-[var(--color-primary-500)] bg-[var(--color-surface-2)]"
                    : ""
                }
              `}
            >
              {acc.label}
            </button>
          ))}
        </section>
      )}

      {/* ───────── Tab 3: Post Type ───────── */}
      {activeTab === 3 && (
        <section className="card space-y-3">
          <h2 className="font-medium">Post type</h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "text", label: "Text" },
              { id: "image", label: "Image" },
              { id: "carousel", label: "Carousel" },
              { id: "announcement", label: "Announcement" },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setPostType(type.id as PostType)}
                className={`
                  px-3 py-3 rounded-md border text-sm
                  hover:bg-[var(--color-surface-2)]
                  ${
                    postType === type.id
                      ? "border-[var(--color-primary-500)] bg-[var(--color-surface-2)]"
                      : ""
                  }
                `}
              >
                {type.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ───────── Tab 4: Content ───────── */}
      {activeTab === 4 && (
        <>
          {/* Editor */}
          <section className="card space-y-5">
            <div>
              <label className="text-sm font-medium">Hook / Title</label>
              <textarea
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Scroll-stopping first line…"
                className="w-full textarea mt-1"
              />
              <button className="text-xs text-primary mt-1">
                Generate with AI
              </button>
            </div>

            <div>
              <label className="text-sm font-medium">Post content</label>
              <textarea
                rows={7}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write or generate your post…"
                className="w-full textarea mt-1"
              />
              <button className="text-xs text-primary mt-1">
                Generate with AI
              </button>
            </div>

            <div>
              <label className="text-sm font-medium">Images</label>
              <div className="mt-1 border rounded-md p-4 text-xs text-text-secondary">
                Upload or generate images (next step)
              </div>
            </div>
          </section>

          {/* Rules */}
          <details className="card">
            <summary className="text-sm font-medium cursor-pointer">
              Platform rules
            </summary>
            <ul className="mt-3 text-sm text-text-secondary space-y-1">
              <li>• Max 3000 characters</li>
              <li>• Up to 5 hashtags</li>
              <li>• Links allowed</li>
            </ul>
            <p className="mt-2 text-xs text-text-secondary">
              Characters: {content.length}/3000
            </p>
          </details>
        </>
      )}

      {/* ───────── Sticky Actions (Mobile-first) ───────── */}
      {activeTab === 4 && (
        <div className="sticky bottom-0 bg-[var(--color-bg)] border-t border-[var(--color-border)] py-3">
          <div className="flex gap-2">
            <button className="flex-1 btn btn-ghost">Save Draft</button>
            <button className="flex-1 btn btn-outline">Schedule</button>
            <button className="flex-1 btn btn-primary">Publish</button>
          </div>
        </div>
      )}
    </div>
  );
}
