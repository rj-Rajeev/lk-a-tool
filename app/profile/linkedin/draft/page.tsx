"use client";

import { useEffect, useState } from "react";

type Draft = {
  id: number;
  topic: string;
};

export default function DraftPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // schedule modal
  const [showSchedule, setShowSchedule] = useState(false);
  const [posting, setPosting] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  // fetch drafts
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/linkedin/draft");
      const data = await res.json();
      setDrafts(data);
    })();
  }, []);

  async function openDraft(draft: Draft) {
    setSelectedId(draft.id);
    setTopic(draft.topic);
    setLoading(true);

    const res = await fetch(`/api/linkedin/draft?id=${draft.id}`);
    const data = await res.json();
    setContent(data?.content || "");
    setLoading(false);
  }

  async function saveDraft() {
    if (!selectedId) return;

    setSaving(true);
    await fetch("/api/linkedin/draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId: selectedId,
        updatedTopic: topic,
        updatedContent: content,
      }),
    });

    setDrafts((prev) =>
      prev.map((d) =>
        d.id === selectedId ? { ...d, topic } : d
      )
    );
    setSaving(false);
  }

  async function schedulePost() {
    if (!selectedId || !dateTime) return;

    setSaving(true);
    await fetch("/api/linkedin/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        draftId: selectedId,
        scheduledAt: dateTime,
        timezone,
      }),
    });

    setSaving(false);
    setShowSchedule(false);
  }

  async function postNow() {
    if (!selectedId) return;

    setPosting(true);
    try {
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: selectedId }),
      });

      if (!res.ok) {
        throw new Error("Failed to publish post");
      }

      // optional: remove draft from list after publish
      setDrafts((prev) => prev.filter((d) => d.id !== selectedId));
      setSelectedId(null);
      setTopic("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Post failed. Check logs.");
    } finally {
      setPosting(false);
    }
  }


  async function deleteDraft() {
    if (!selectedId) return;

    await fetch("/api/linkedin/draft", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId: selectedId }),
    });

    setDrafts((prev) => prev.filter((d) => d.id !== selectedId));
    setSelectedId(null);
    setTopic("");
    setContent("");
  }

  return (
    <>
      <div className="min-h-screen bg-bg text-text px-6 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Draft List */}
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-medium mb-3">Drafts</h3>

            <ul className="space-y-2">
              {drafts.map((d) => (
                <li
                  key={d.id}
                  onClick={() => openDraft(d)}
                  className={`cursor-pointer px-4 py-3 rounded-lg border text-sm
                    ${
                      selectedId === d.id
                        ? "border-primary bg-yellow-50 font-medium"
                        : "hover:bg-gray-50"
                    }`}
                >
                  {d.topic}
                </li>
              ))}
            </ul>

            {drafts.length === 0 && (
              <p className="text-sm text-muted">No drafts found</p>
            )}
          </div>

          {/* Editor */}
          <div className="md:col-span-2 bg-white border rounded-xl shadow-sm flex flex-col">

            <div className="border-b px-4 py-3">
              <h3 className="text-lg font-medium">
                {selectedId ? "Edit Draft" : "Select a draft"}
              </h3>
            </div>

            <div className="flex-1 p-4 space-y-3">
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={!selectedId}
                className="w-full h-10 px-3 text-sm border rounded-md"
                placeholder="Draft title"
              />

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!selectedId}
                className="w-full min-h-[260px] p-3 text-sm border rounded-md bg-gray-50"
                placeholder="Write LinkedIn post..."
              />
            </div>

            {/* Action Bar */}
            {selectedId && (
              <div className="border-t px-4 py-3 flex justify-between items-center">
                <button
                  onClick={deleteDraft}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={postNow}
                    disabled={posting}
                    className="h-10 px-4 rounded-md bg-black text-white text-sm font-medium"
                  >
                    {posting ? "Posting…" : "Post Now"}
                  </button>

                  <button
                    onClick={() => setShowSchedule(true)}
                    className="h-10 px-4 rounded-md border text-sm"
                  >
                    Schedule
                  </button>

                  <button
                    onClick={saveDraft}
                    disabled={saving}
                    className="h-10 px-5 rounded-md bg-primary text-black text-sm font-medium hover:bg-primaryHover"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowSchedule(false)}
          />

          <div className="relative bg-white w-full max-w-md rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-lg font-medium">Schedule Post</h3>

            <div>
              <label className="text-sm font-medium">Date & Time</label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full h-10 px-3 mt-1 text-sm border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full h-10 px-3 mt-1 text-sm border rounded-md"
              >
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSchedule(false)}
                className="h-9 px-4 rounded-md border text-sm"
              >
                Cancel
              </button>
              <button
                onClick={schedulePost}
                className="h-9 px-4 rounded-md bg-primary text-black text-sm font-medium"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
