"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Draft = {
  id: number;
  topic: string;
  content: string;
  status: "draft" | "scheduled" | "published";
};

export default function DraftPage() {
  const { id } = useParams();
  const router = useRouter();

  const [draft, setDraft] = useState<Draft | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch draft
  useEffect(() => {
    fetch(`/api/linkedin/draft?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setDraft(data);
        setContent(data.content);
      });
  }, [id]);

  // Update draft content
  const updateDraft = async () => {
    setLoading(true);

    await fetch(`/api/linkedin/draft?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    setLoading(false);
    alert("Draft updated");
  };

  // Approve draft
  const approveDraft = async () => {
    setLoading(true);

    await fetch(`/api/linkedin/draft/approve?id=${id}`, {
      method: "POST",
    });

    setLoading(false);
    alert("Draft approved & scheduled");
    router.push("/dashboard");
  };

  if (!draft) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h1>Draft Review</h1>

      <p><strong>ID:</strong> {draft.id}</p>
      <p><strong>Topic:</strong> {draft.topic}</p>
      <p><strong>Status:</strong> {draft.status}</p>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={14}
        style={{
          width: "100%",
          marginTop: 12,
          padding: 12,
          fontSize: 14,
        }}
      />

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <button onClick={updateDraft} disabled={loading}>
          Save Changes
        </button>

        {draft.status === "draft" && (
          <button onClick={approveDraft} disabled={loading}>
            Approve & Schedule
          </button>
        )}
      </div>
    </div>
  );
}
