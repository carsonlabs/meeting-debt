"use client";

import { useState } from "react";
import { calculateMeeting, type MeetingReceipt } from "@/lib/calculator";
import { Receipt } from "./Receipt";

const PRESETS = [
  { label: "Quick sync", attendees: 3, duration: 15 },
  { label: "Sprint planning", attendees: 8, duration: 60 },
  { label: "All-hands", attendees: 25, duration: 45 },
  { label: "Board meeting", attendees: 10, duration: 90 },
];

export function MeetingForm() {
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState(6);
  const [duration, setDuration] = useState(30);
  const [salary, setSalary] = useState(120000);
  const [receipt, setReceipt] = useState<MeetingReceipt | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  function handleCalculate() {
    setIsCalculating(true);
    // Fake delay for dramatic effect
    setTimeout(() => {
      const result = calculateMeeting({
        attendees,
        durationMinutes: duration,
        avgSalary: salary,
        meetingTitle: title,
      });
      setReceipt(result);
      setIsCalculating(false);
    }, 1200);
  }

  function handlePreset(preset: (typeof PRESETS)[number]) {
    setTitle(preset.label);
    setAttendees(preset.attendees);
    setDuration(preset.duration);
  }

  function handleReset() {
    setReceipt(null);
  }

  if (receipt) {
    return <Receipt receipt={receipt} onReset={handleReset} />;
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Presets */}
      <div className="mb-8">
        <p className="text-sm text-neutral-400 mb-3">Quick presets:</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePreset(p)}
              className="px-3 py-1.5 text-sm rounded-full border border-neutral-700 text-neutral-300 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Meeting title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekly standup, Sprint planning..."
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Number of attendees
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={2}
              max={50}
              value={attendees}
              onChange={(e) => setAttendees(Number(e.target.value))}
              className="flex-1 accent-red-500"
            />
            <span className="text-2xl font-bold text-red-400 w-12 text-right tabular-nums">
              {attendees}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Duration (minutes)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={5}
              max={180}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="flex-1 accent-red-500"
            />
            <span className="text-2xl font-bold text-red-400 w-16 text-right tabular-nums">
              {duration}m
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Avg. annual salary per person
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={40000}
              max={300000}
              step={5000}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="flex-1 accent-red-500"
            />
            <span className="text-lg font-bold text-red-400 w-24 text-right tabular-nums">
              ${(salary / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        {/* Live preview */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-center">
          <p className="text-neutral-400 text-sm">Live burn rate</p>
          <p className="text-3xl font-bold text-red-500 tabular-nums">
            $
            {(
              (salary / 2080 / 60) *
              attendees *
              duration
            ).toFixed(2)}
          </p>
          <p className="text-neutral-500 text-xs mt-1">
            ${((salary / 2080 / 60) * attendees).toFixed(2)}/min
            &middot; {((duration * attendees) / 60).toFixed(1)} person-hours
          </p>
        </div>

        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 text-white font-bold text-lg rounded-lg transition-colors cursor-pointer"
        >
          {isCalculating ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Calculating the damage...
            </span>
          ) : (
            "Generate My Receipt"
          )}
        </button>
      </div>
    </div>
  );
}
