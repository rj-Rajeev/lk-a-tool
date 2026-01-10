"use client";

import { useFcmToken } from "@/hooks/useFcmToken";
import { formatDateToLocalISO, formatTimeToLocalISO } from "@/utils/dateTimeFormetter";
import { useEffect, useState } from "react";

export default function AutomationScheduleModal({
  provider,
  onClose,
}: {
  provider: "linkedin";
  onClose: () => void;
}) {

  const { token, requestToken } = useFcmToken();
  const [ruleType, setRuleType] =
    useState<"daily" | "alternate" | "specific_days">("daily");

  const [errors, setErrors] = useState<{startDate?: boolean; time?: boolean; }>({});

  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD (local)
  const [endDate, setEndDate] = useState("");     // YYYY-MM-DD (optional)
  const [time, setTime] = useState("");           // HH:mm (local)
  const [days, setDays] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  function toggleDay(day: string) {
    setDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  }

  async function save() {
    setLoading(true);

    await requestToken();
    
    const newErrors: any = {};

      if (!startDate) newErrors.startDate = true;
      if (!time) newErrors.time = true;

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        return; // stop submit
      }
    await fetch("/api/automation-schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        rule_type: ruleType,

        // ✅ RAW LOCAL VALUES
        start_date: new Date(startDate+" "+time).toISOString().split('T')[0],
        end_date: endDate && time ? new Date(endDate+" "+time).toISOString().split('T')[0] : null,
        times: [new Date(startDate+" "+time).toISOString().slice(11,19)],
        days: ruleType === "specific_days" ? days : null,
        is_active: isActive ? 1 : 0,
      }),
    });

    setLoading(false);
    onClose();
  }

  async function get() {
    const res = await fetch('/api/automation-schedule?provider=linkedin');
    const data = await res.json();

    
    let startDate = formatDateToLocalISO(new Date(data[0].start_date.split('T')[0]+'T'+data[0].times[0]+'Z')).split('T')[0];
    setStartDate(startDate);
    let endDate = formatDateToLocalISO(new Date(data[0].end_date.split('T')[0]+'T'+data[0].times[0]+'Z')).split('T')[0];
    setEndDate(endDate);
    let localTime = formatTimeToLocalISO(new Date(data[0].start_date.split('T')[0]+'T'+data[0].times[0]+'Z'))
    setTime(localTime);
    setIsActive(data[0]?.is_active);
  }

    useEffect(() => {
    const fetchData = async () => {
        try {
        await get();
        } catch (err) {
        console.error("Failed to fetch automation schedule:", err);
        }
    };

    fetchData();
    }, []);


  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Bottom sheet */}
      <div className="relative w-full sm:max-w-md bg-surface rounded-t-xl sm:rounded-xl p-6 shadow-lg elative w-full md:max-w-md animate-slide-up">
        <h3 className="text-lg font-semibold mb-4">
          Automation schedule
        </h3>

        {/* Rule */}
        <div className="mb-4">
          <label className="label">Rule</label>
          <select
            className="input"
            value={ruleType}
            onChange={(e) =>
              setRuleType(e.target.value as any)
            }
          >
            <option value="daily">Daily</option>
            <option value="alternate">Alternate days</option>
            <option value="specific_days">Specific days</option>
          </select>
        </div>

        {/* Days */}
        {ruleType === "specific_days" && (
          <div className="mb-4">
            <label className="label">Days</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    days.includes(d)
                      ? "bg-primary-100 border-primary-500"
                      : "hover:bg-surface-2"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Date */}
        <div className="mb-4">
          <label className="label">Start date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setErrors((prev) => ({ ...prev, startDate: false }));
            }}
            className={`input ${errors.startDate ? "border-red-500 ring-1 ring-red-500" : ""}`}
          />
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label className="label">End date (optional)</label>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="input"
          />
        </div>

        {/* Time */}
        <div className="mb-4">
          <label className="label">Posting time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              setErrors((prev) => ({ ...prev, time: false }));
            }}
            className={`input ${errors.time ? "border-red-500 ring-1 ring-red-500" : ""}`}
          />
        </div>

        {/* Active toggle */}
        <div className="flex items-center justify-between border-t pt-4 mb-6">
          <span className="text-sm font-medium">
            Automation active
          </span>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 accent-primary-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
