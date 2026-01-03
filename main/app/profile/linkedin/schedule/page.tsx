"use client";

import { useEffect, useState } from "react";

/* =======================
   TYPES
======================= */

type Schedule = {
  id: number;
  topic: string;
  scheduled_at: string; // UTC
  status: "pending" | "done";
  draft_id: number;
};

/* =======================
   HELPERS
======================= */

function utcToLocalInput(utc: string) {
  const d = new Date(utc);
  
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getScheduleState(utc: string) {
  const now = new Date();
  const d = new Date(utc);
  const diffMs = d.getTime() - now.getTime();
  const diffMin = diffMs / 60000;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 0) {
    return { label: "Overdue", class: "bg-red-100 text-red-600" };
  }
  if (diffMin <= 120) {
    return { label: `Soon (${Math.ceil(diffMin)} min left)`, class: "bg-yellow-100 text-yellow-700" };
  }
  if (diffMs < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diffMin / 60);
    const minutes = Math.floor(diffMin % 60);
    return { label: `Scheduled (${hours}h ${minutes}m left)`, class: "bg-surface-2 text-text-secondary" };
  }
  return { label: `Scheduled (${diffDays} day${diffDays !== 1 ? "s" : ""} left)`, class: "bg-surface-2 text-text-secondary" };
}

function isToday(date: Date) {
  const now = new Date();
  return now.toDateString() === date.toDateString();
}

function isTomorrow(date: Date) {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toDateString() === date.toDateString();
}

/* =======================
   PAGE
======================= */

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [active, setActive] = useState<Schedule | null>(null);
  const [dateTime, setDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  /* =======================
     DATA
  ======================= */

  async function loadSchedules() {
    const res = await fetch("/api/linkedin/schedule");
    const data = await res.json();
    setSchedules(data.filter((s: Schedule) => s.status !== "done"));
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  /* =======================
     GROUPED DATA
  ======================= */

  const todayItems = schedules.filter((s) =>
    isToday(new Date(s.scheduled_at))
  );

  const tomorrowItems = schedules.filter((s) =>
    isTomorrow(new Date(s.scheduled_at))
  );

  const laterItems = schedules.filter((s) => {
    const d = new Date(s.scheduled_at);
    return !isToday(d) && !isTomorrow(d);
  });

  /* =======================
     ACTIONS
  ======================= */

  function open(schedule: Schedule) {
    setActive(schedule);
    setDateTime(utcToLocalInput(schedule.scheduled_at));
    setConfirmCancel(false);
  }

  function close() {
    setActive(null);
    setDateTime("");
    setConfirmCancel(false);
    setLoading(false);
  }

  async function updateSchedule() {
    if (!active || !dateTime) return;

    setLoading(true);
    await fetch("/api/linkedin/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        draftId: active.draft_id,
        scheduledAt: new Date(dateTime).toISOString(), // UTC
      }),
    });

    close();
    loadSchedules();
  }

  async function cancelSchedule() {
    if (!active) return;

    setLoading(true);
    await fetch("/api/linkedin/schedule", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draftId: active.draft_id }),
    });

    close();
    loadSchedules();
  }

  /* =======================
     RENDER
  ======================= */

  return (
    <>
      <div className="min-h-screen bg-bg px-4 sm:px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* HEADER */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Scheduled posts</h2>
            <p className="text-sm text-text-secondary">
              Times shown in your local timezone
            </p>
          </div>

          {/* EMPTY STATE */}
          {schedules.length === 0 && (
            <div className="card text-center space-y-2">
              <p className="font-medium">No scheduled posts</p>
              <p className="text-sm text-text-muted">
                Schedule your first LinkedIn post to see it here.
              </p>
            </div>
          )}

          {/* TODAY */}
          {todayItems.length > 0 && (
            <Section title="Today">
              {todayItems.map((s) => (
                <ScheduleCard key={s.id} s={s} onClick={open} highlight />
              ))}
            </Section>
          )}

          {/* TOMORROW */}
          {tomorrowItems.length > 0 && (
            <Section title="Tomorrow">
              {tomorrowItems.map((s) => (
                <ScheduleCard key={s.id} s={s} onClick={open} />
              ))}
            </Section>
          )}

          {/* LATER */}
          {laterItems.length > 0 && (
            <Section title="Upcoming">
              {laterItems.map((s) => (
                <ScheduleCard key={s.id} s={s} onClick={open} />
              ))}
            </Section>
          )}
        </div>
      </div>

      {/* =======================
          RESCHEDULE DRAWER
      ======================= */}
      {active && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={close}
          />

          <div className="relative bg-surface w-full sm:w-[420px] h-[85%] sm:h-full mt-auto sm:ml-auto rounded-t-xl sm:rounded-none p-6 flex flex-col shadow-lg">
            <div className="pb-4 border-b space-y-1">
              <h3 className="text-lg font-semibold">Reschedule post</h3>
              <p className="text-sm text-text-secondary truncate">
                {active.topic}
              </p>
            </div>

            <div className="flex-1 py-5 space-y-4">
              <label className="label">Date & time</label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="input"
              />
              <p className="text-xs text-text-muted">
                Automatically converted to UTC
              </p>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              {!confirmCancel ? (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Cancel schedule
                </button>
              ) : (
                <div className="flex gap-3 text-sm">
                  <span className="text-text-muted">Confirm?</span>
                  <button
                    onClick={cancelSchedule}
                    disabled={loading}
                    className="text-red-600 font-medium"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmCancel(false)}
                    className="text-text-muted"
                  >
                    No
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={close} className="btn-secondary">
                  Close
                </button>
                <button
                  onClick={updateSchedule}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? "Updating…" : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =======================
   COMPONENTS
======================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-secondary">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ScheduleCard({
  s,
  onClick,
  highlight,
}: {
  s: Schedule;
  onClick: (s: Schedule) => void;
  highlight?: boolean;
}) {
  const state = getScheduleState(s.scheduled_at);

  return (
    <button
      onClick={() => onClick(s)}
      className={`card w-full text-left space-y-2 ${
        highlight ? "ring-2 ring-primary-300" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium">{s.topic}</p>
        <span className={`text-xs px-2 py-1 rounded-full bg-surface-2 text-text-secondary`}>{s.status}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${state.class}`}
        >
          {state.label}
        </span>
      </div>

      <p className="text-sm text-text-secondary">
        {new Date(s.scheduled_at).toLocaleString()}
      </p>
    </button>
  );
}
