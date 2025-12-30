"use client";

import { useEffect, useState } from "react";

type PublishedPost = {
  id: number;
  draft_id: number;
  provider: string;
  platform_post_id: string;
  published_at: string;
  created_at: string;
  topic: string;
  content: string;
};

export default function PublishedPage() {
  const [posts, setPosts] = useState<PublishedPost[]>([]);
  const [selected, setSelected] = useState<PublishedPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublished();
  }, []);

  async function fetchPublished() {
    setLoading(true);
    const res = await fetch("/api/linkedin/publish");
    const data = await res.json();
    setPosts(data || []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg text-text px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Published Posts</h1>
          <p className="text-sm text-text-secondary">
            Posts that have been successfully published to LinkedIn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT: Published list */}
          <div className="card">
            <h3 className="text-lg font-medium mb-3">History</h3>

            {loading && (
              <p className="text-sm text-text-muted">Loading…</p>
            )}

            <ul className="space-y-2">
              {posts.map((p) => (
                <li
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`cursor-pointer border rounded-lg px-4 py-3 text-sm transition
                    ${
                      selected?.id === p.id
                        ? "border-primary bg-primary-50 font-medium"
                        : "hover:bg-surface-2"
                    }`}
                >
                  <p className="truncate">{p.topic}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {new Date(p.published_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>

            {!loading && posts.length === 0 && (
              <p className="text-sm text-text-muted">
                No published posts yet
              </p>
            )}
          </div>

          {/* RIGHT: Preview */}
          <div className="md:col-span-2 card flex flex-col">

            {!selected ? (
              <div className="text-sm text-text-muted">
                Select a post to preview
              </div>
            ) : (
              <>
                {/* Meta */}
                <div className="border-b pb-3 mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selected.topic}
                    </h3>
                    <p className="text-xs text-text-muted">
                      Published on{" "}
                      {new Date(selected.published_at).toLocaleString()}
                    </p>
                  </div>

                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Published
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <textarea
                    readOnly
                    value={selected.content}
                    className="w-full min-h-[260px] p-3 text-sm border rounded-md bg-surface-2"
                  />
                </div>

                {/* Footer */}
                <div className="pt-4 flex justify-between items-center text-xs text-text-muted">
                  <span>Provider: {selected.provider}</span>

                  {selected.platform_post_id && (
                    <a
                      href={`https://www.linkedin.com/feed/update/${selected.platform_post_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      View on LinkedIn →
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
