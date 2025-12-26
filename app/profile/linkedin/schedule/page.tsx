"use client";

import { useEffect, useState } from "react";

type Schedule = {
  id: number;
  topic: string;
  scheduled_at: string;
  timezone: string;
  status: "pending" | "done";
  draft_id: number;
};

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [open, setOpen] = useState(false);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [dateTime, setDateTime] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [loading, setLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  async function fetchSchedules() {
    const res = await fetch("/api/linkedin/schedule");
    const data = await res.json();
    setSchedules(data);
  }

  function openModal(schedule: Schedule) {
    setDraftId(schedule.draft_id);
    setDateTime(schedule.scheduled_at.slice(0, 16));
    setTimezone(schedule.timezone);
    setConfirmCancel(false);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setDraftId(null);
    setDateTime("");
    setTimezone("Asia/Kolkata");
    setConfirmCancel(false);
    setLoading(false);
  }

  async function saveSchedule() {
    console.log(draftId);
    console.log(dateTime);
    
    if (!draftId || !dateTime) return;

    setLoading(true);
    await fetch("/api/linkedin/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        draftId,
        scheduledAt: dateTime,
        timezone,
      }),
    });

    closeModal();
    fetchSchedules();
  }

  async function cancelSchedule() {
    if (!draftId) return;

    setLoading(true);
    await fetch("/api/linkedin/schedule", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draftId }),
    });

    closeModal();
    fetchSchedules();
  }

  return (
    <>
      {/* PAGE */}
      <div className="min-h-screen bg-bg text-text px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold">Scheduled Posts</h2>

          <div className="grid gap-4">
            {schedules.map((s) => (
              <div
                key={s.id}
                className="bg-white border rounded-xl p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{s.topic}</p>
                  <p className="text-sm text-muted">
                    {new Date(s.scheduled_at).toLocaleString()} · {s.timezone}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      s.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {s.status}
                  </span>

                  <button
                    onClick={() => openModal(s)}
                    className="h-9 px-4 rounded-md border text-sm hover:bg-gray-50"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))}

            {schedules.length === 0 && (
              <p className="text-sm text-muted">No scheduled posts</p>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />

          <div className="relative bg-white w-full max-w-md rounded-xl p-5 shadow-lg space-y-4">
            <h3 className="text-lg font-medium">Reschedule Post</h3>

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

            {/* ACTIONS */}
            <div className="flex justify-between pt-2">
              {!confirmCancel ? (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Cancel schedule
                </button>
              ) : (
                <div className="flex gap-2 text-sm">
                  <span className="text-muted">Confirm?</span>
                  <button
                    onClick={cancelSchedule}
                    disabled={loading}
                    className="text-red-600 font-medium"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmCancel(false)}
                    className="text-muted"
                  >
                    No
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="h-9 px-4 rounded-md border text-sm"
                >
                  Close
                </button>
                <button
                  onClick={saveSchedule}
                  disabled={loading}
                  className="h-9 px-4 rounded-md bg-primary text-black text-sm font-medium hover:bg-primaryHover disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
