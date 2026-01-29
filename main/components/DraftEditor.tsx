"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Draft = {
  id: number;
  topic: string;
  is_approved: boolean;
  approved_at: string | null;
};

const PAGE_SIZE = 5;

export default function DraftEditor({
  initialDraftId,
}: {
  initialDraftId?: number;
}) {
  const router = useRouter();

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(
    initialDraftId ?? null
  );
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [page, setPage] = useState(0);

  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  // fetch drafts
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/linkedin/draft");
      const data = await res.json();
      setDrafts(data);
    })();
  }, []);

  const selectedDraft = drafts.find(d => d.id === selectedId);
  const isApproved = selectedDraft?.is_approved ?? false;

  const isDirty =
    !!selectedDraft &&
    (topic !== selectedDraft.topic || content !== "");

  const start = page * PAGE_SIZE;
  const visibleDrafts = drafts.slice(start, start + PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = start + PAGE_SIZE < drafts.length;

  async function openDraft(draft: Draft) {
    setSelectedId(draft.id);
    setTopic(draft.topic);
    setConfirmDelete(false);

    const res = await fetch(`/api/linkedin/draft?id=${draft.id}`);
    const data = await res.json();
    setContent(data?.content || "");

    setTimeout(() => editorRef.current?.focus(), 0);
  }

  // auto-open from URL
  useEffect(() => {
    if (!initialDraftId || drafts.length === 0) return;

    const draft = drafts.find(d => d.id === initialDraftId);
    if (draft) openDraft(draft);
  }, [initialDraftId, drafts]);

  async function saveDraft() {
    if (!selectedId || isApproved) return;

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

    setDrafts(prev =>
      prev.map(d => (d.id === selectedId ? { ...d, topic } : d))
    );
    setSaving(false);
  }

  async function approveDraft() {
    if (!selectedId || isApproved) return;

    setSaving(true);
    await fetch("/api/linkedin/draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicId: selectedId,
        is_approved: true,
      }),
    });

    setDrafts(prev =>
      prev.map(d =>
        d.id === selectedId
          ? { ...d, is_approved: true, approved_at: new Date().toISOString() }
          : d
      )
    );
    setSaving(false);
  }

  async function deleteDraft() {
    if (!selectedId) return;

    await fetch("/api/linkedin/draft", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId: selectedId }),
    });

    setDrafts(prev => prev.filter(d => d.id !== selectedId));
    setSelectedId(null);
    setTopic("");
    setContent("");
    setConfirmDelete(false);

    router.push("/profile/linkedin/draft");
  }

  async function publishDraft() {
    if (!selectedId || !isApproved) return;
    setSaving(true);

    await fetch("/api/linkedin/publish", {
      method: "POST",
      body: JSON.stringify({ draftId: selectedId }),
    });

    setSaving(false);
    
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-bg text-text px-4 py-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Draft List */}
        <div className="bg-white border rounded-xl p-4 shadow-sm max-h-[70vh] overflow-y-auto">
          <h3 className="text-lg font-medium mb-3">Drafts</h3>

          <ul className="space-y-2">
            {visibleDrafts.map(d => (
              <li
                key={d.id}
                onClick={() => openDraft(d)}
                className={`cursor-pointer px-4 py-3 rounded-lg border text-sm
                  ${selectedId === d.id
                    ? "border-primary bg-yellow-50 font-medium"
                    : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{d.topic}</span>

                  {!!d.is_approved && (
                    <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                      Approved
                    </span>
                  )}
                </div>

                {!!d.is_approved && d.approved_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    Approved at {new Date(d.approved_at).toLocaleString()}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {drafts.length === 0 && (
            <p className="text-sm text-gray-500">No drafts found</p>
          )}

          {/* Pagination */}
          {drafts.length > PAGE_SIZE && (
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={!hasPrev}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 text-sm rounded border disabled:opacity-40"
              >
                Prev
              </button>

              <span className="text-xs text-gray-500">
                {start + 1}–{Math.min(start + PAGE_SIZE, drafts.length)} of {drafts.length}
              </span>

              <button
                disabled={!hasNext}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 text-sm rounded border disabled:opacity-40"
              >
                Next
              </button>
            </div>
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
              onChange={e => setTopic(e.target.value)}
              disabled={!selectedId || isApproved}
              className="w-full h-10 px-3 text-sm border rounded-md"
              placeholder="Draft title"
            />

            <textarea
              ref={editorRef}
              value={content}
              onChange={e => setContent(e.target.value)}
              disabled={!selectedId || isApproved}
              className="w-full min-h-[260px] p-3 text-sm border rounded-md bg-gray-50"
              placeholder="Write LinkedIn post..."
            />

            {!!isApproved && (
              <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded">
                This draft is approved and locked.
              </p>
            )}
          </div>

          {/* Action Bar */}
          {selectedId && (
            <div className="border-t px-4 py-3 flex justify-between items-center flex-wrap gap-3">

              {/* Delete */}
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              ) : (
                <div className="flex gap-3 items-center">
                  <span className="text-sm text-gray-600">Delete draft?</span>
                  <button
                    onClick={deleteDraft}
                    className="text-sm text-red-600 font-medium"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-sm text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {!isApproved && (
                  <button
                    onClick={approveDraft}
                    disabled={saving}
                    className="h-10 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                  >
                    {saving ? "Approving…" : "Approve Draft"}
                  </button>
                )}

                <button
                  onClick={publishDraft}
                  disabled={saving}
                  className="h-10 px-5 rounded-md bg-primary text-black text-sm font-medium disabled:opacity-40"
                >
                  {saving ? "Publishing…" : "Publish"}
                </button>
                <button
                  onClick={saveDraft}
                  disabled={saving || !isDirty || isApproved}
                  className="h-10 px-5 rounded-md bg-primary text-black text-sm font-medium disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
