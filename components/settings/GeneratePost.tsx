"use client";

import { useEffect, useState } from "react";

export default function GeneratePost() {
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"topics" | "content">("topics");
  const [message, setMessage] = useState("");

  // Fetch topics when modal opens
  useEffect(() => {
    if (!open) return;

    async function fetchTopics() {
      setLoading(true);
      try {
        const res = await fetch("/api/linkedin/topics");
        const data = await res.json();
        setTopics(data.topics || []);
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, [open]);

  async function handleTopicSelect(topic: string) {
    setSelectedTopic(topic);
    setStep("content");
    setLoading(true);

    try {
      const res = await fetch("/api/linkedin/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setPost(data.content || "");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDraft() {
    if (!post || !selectedTopic) return;

    setLoading(true);
    setMessage("");

    try {
      await fetch("/api/linkedin/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          content: post,
        }),
      });

      setMessage("Draft saved successfully ✓");
    } catch {
      setMessage("Failed to save draft");
    } finally {
      setLoading(false);
      closeModal();
    }
  }

  function closeModal() {
    setOpen(false);
    setTopics([]);
    setSelectedTopic("");
    setPost("");
    setMessage("");
    setStep("topics");
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="btn-primary"
      >
        Generate Post
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg bg-white rounded-xl p-5 shadow-lg space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  {step === "topics"
                    ? "Choose a Topic"
                    : "Edit & Save Post"}
                </h3>
                <p className="text-xs text-text-muted">
                  Step {step === "topics" ? "1" : "2"} of 2
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-sm text-text-muted"
              >
                Close
              </button>
            </div>

            {/* STEP 1: TOPICS */}
            {step === "topics" && (
              <>
                {loading ? (
                  <p className="text-sm text-text-muted">Loading topics…</p>
                ) : (
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {topics.map((topic, i) => (
                      <li
                        key={i}
                        onClick={() => handleTopicSelect(topic)}
                        className={`cursor-pointer border rounded-lg px-4 py-3 text-sm transition
                          ${
                            selectedTopic === topic
                              ? "border-primary bg-primary-50 font-medium"
                              : "hover:bg-surface-2"
                          }`}
                      >
                        {topic}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {/* STEP 2: CONTENT */}
            {step === "content" && (
              <>
                {loading ? (
                  <p className="text-sm text-text-muted">
                    Generating content…
                  </p>
                ) : (
                  <>
                    {/* Editable textarea */}
                    <textarea
                      value={post}
                      onChange={(e) => setPost(e.target.value)}
                      className="w-full min-h-[200px] p-3 text-sm border rounded-md"
                    />

                    {message && (
                      <p className="text-xs text-green-600">{message}</p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => setStep("topics")}
                        className="text-sm text-text-muted"
                      >
                        ← Change topic
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveDraft}
                          disabled={loading}
                          className="btn-secondary"
                        >
                          Save Draft
                        </button>
                        <button
                          disabled
                          className="btn-primary opacity-50 cursor-not-allowed"
                          title="Schedule from Drafts page"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
