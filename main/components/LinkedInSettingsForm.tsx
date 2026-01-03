"use client";

import { useEffect, useState } from "react";

type PromptConfigState = {
  provider: string;
  motive: string;
  niche: string;
  tone: string;
  expertise_level: string;
  rules: string;
};

const DEFAULT_STATE: PromptConfigState = {
  provider: '',
  motive: "",
  niche: "",
  tone: "Simple",
  expertise_level: "Beginner",
  rules: "",
};

export function LinkedInSettingsForm() {
  const [state, setState] = useState<PromptConfigState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Load existing LinkedIn settings
   */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/linkedin/settings");
        if (!res.ok) return;

        const json = await res.json();
        if (json.data) {
          setState({
            motive: json.data.motive || "",
            niche: json.data.niche || "",
            tone: json.data.tone || "Simple",
            expertise_level: json.data.expertise_level || "Beginner",
            rules: json.data.rules || "",
            provider: 'linkedin'
          });
        }
      } catch {
        // silent fail → empty form
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  /**
   * Save settings
   */
  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    state.provider='linkedin'
    if (!state.motive.trim()) {
      setError("Motive is required");
      return;
    }


    if (!state.niche.trim()) {
      setError("Niche is required");
      return;
    }

    if (!state.rules.trim()) {
      setError("Rules are required");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch("/api/linkedin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to save settings");
      }

      setSuccess("LinkedIn settings saved successfully");
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p className="text-sm text-text-secondary">Loading settings…</p>
      </div>
    );
  }

  return (
    <div className="card space-y-5">
      <h2 className="text-lg font-semibold">LinkedIn Content Settings</h2>

      {/* Motive */}
      <div className="space-y-1">
        <label className="label">Motive</label>
        <input
          className="input"
          placeholder="Why are you creating LinkedIn content?"
          value={state.motive}
          onChange={(e) =>
            setState({ ...state, motive: e.target.value })
          }
        />
      </div>

      {/* Niche */}
      <div className="space-y-1">
        <label className="label">Niche</label>
        <input
          className="input"
          placeholder="Technology, Software Development, GenAI"
          value={state.niche}
          onChange={(e) =>
            setState({ ...state, niche: e.target.value })
          }
        />
      </div>

      {/* Tone */}
      <div className="space-y-1">
        <label className="label">Tone</label>
        <select
          className="input"
          value={state.tone}
          onChange={(e) =>
            setState({ ...state, tone: e.target.value })
          }
        >
          <option value="Simple">Simple</option>
          <option value="Conversational">Conversational</option>
          <option value="Professional">Professional</option>
          <option value="Bold">Bold</option>
        </select>
      </div>

      {/* Expertise Level */}
      <div className="space-y-1">
        <label className="label">Expertise Level</label>
        <select
          className="input"
          value={state.expertise_level}
          onChange={(e) =>
            setState({ ...state, expertise_level: e.target.value })
          }
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {/* Rules */}
      <div className="space-y-1">
        <label className="label">Rules</label>
        <textarea
          className="input min-h-[120px]"
          placeholder="Example:
- No emojis
- Short lines
- Include a hook and a question at the end"
          value={state.rules}
          onChange={(e) =>
            setState({ ...state, rules: e.target.value })
          }
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <div className="flex justify-end">
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
