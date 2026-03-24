"use client";

import { useRef } from "react";
import type { MeetingReceipt } from "@/lib/calculator";

const SEVERITY_COLORS = {
  mild: "text-yellow-500",
  painful: "text-orange-500",
  brutal: "text-red-500",
  catastrophic: "text-red-600",
};

const SEVERITY_LABELS = {
  mild: "MINOR DAMAGE",
  painful: "PAINFUL",
  brutal: "BRUTAL",
  catastrophic: "CATASTROPHIC",
};

export function Receipt({
  receipt,
  onReset,
}: {
  receipt: MeetingReceipt;
  onReset: () => void;
}) {
  const receiptRef = useRef<HTMLDivElement>(null);

  function handleCopyText() {
    const lines = [
      `MEETING DEBT RECEIPT`,
      `====================`,
      ``,
      `${receipt.title}`,
      `${receipt.attendees} attendees x ${receipt.durationMinutes} min`,
      ``,
      `--- LINE ITEMS ---`,
      ...receipt.snarkyLineItems.map(
        (item) => `${item.label.padEnd(40)} ${item.amount}`
      ),
      ``,
      `TOTAL: $${receipt.totalCost.toFixed(2)}`,
      `Per person: $${receipt.perPersonCost.toFixed(2)}`,
      `Person-hours consumed: ${receipt.devHoursConsumed.toFixed(1)}`,
      ``,
      `VERDICT: ${receipt.verdict}`,
      ``,
      `Instead, you could've shipped:`,
      ...receipt.couldHaveShipped.map((s) => `  - ${s}`),
      ``,
      `---`,
      `meetingdebt.com`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* The Receipt */}
      <div
        ref={receiptRef}
        className="bg-[#faf6f0] text-[#1a1a1a] rounded-sm shadow-2xl overflow-hidden"
        style={{ fontFamily: '"Courier New", Courier, monospace' }}
      >
        {/* Torn top edge */}
        <div
          className="h-4 bg-[#faf6f0]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10px -5px, transparent 12px, #faf6f0 12px)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0",
          }}
        />

        <div className="px-6 pb-6">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold tracking-wider">MEETING DEBT</h2>
            <p className="text-xs text-[#666] tracking-widest uppercase">
              Official Receipt of Wasted Potential
            </p>
            <div className="mt-2 text-xs text-[#999]">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Dashed separator */}
          <div className="border-t border-dashed border-[#ccc] my-3" />

          {/* Meeting title */}
          <div className="text-center mb-3">
            <p className="font-bold text-lg">{receipt.title}</p>
            <p className="text-sm text-[#666]">
              {receipt.attendees} attendees &middot; {receipt.durationMinutes}{" "}
              minutes
            </p>
          </div>

          <div className="border-t border-dashed border-[#ccc] my-3" />

          {/* Line items */}
          <div className="space-y-2 text-sm">
            {receipt.snarkyLineItems.map((item, i) => (
              <div key={i} className="flex justify-between gap-2">
                <span className="text-[#444] flex-1">{item.label}</span>
                <span className="font-bold whitespace-nowrap">
                  {item.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-[#ccc] my-3" />

          {/* Total */}
          <div className="text-center">
            <p className="text-xs text-[#999] uppercase tracking-wider">
              Total Meeting Cost
            </p>
            <p className="text-4xl font-black mt-1">
              ${receipt.totalCost.toFixed(2)}
            </p>
            <div className="flex justify-center gap-6 mt-2 text-xs text-[#666]">
              <span>${receipt.perPersonCost.toFixed(2)}/person</span>
              <span>{receipt.devHoursConsumed.toFixed(1)} person-hrs</span>
            </div>
          </div>

          <div className="border-t border-dashed border-[#ccc] my-3" />

          {/* Severity badge */}
          <div className="text-center my-4">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold tracking-wider border-2 ${
                receipt.severityLevel === "catastrophic"
                  ? "border-red-600 text-red-600 bg-red-50"
                  : receipt.severityLevel === "brutal"
                  ? "border-red-500 text-red-500 bg-red-50"
                  : receipt.severityLevel === "painful"
                  ? "border-orange-500 text-orange-500 bg-orange-50"
                  : "border-yellow-600 text-yellow-600 bg-yellow-50"
              }`}
            >
              {SEVERITY_LABELS[receipt.severityLevel]}
            </span>
          </div>

          {/* Verdict */}
          <div className="bg-[#f0ece4] rounded p-3 text-center">
            <p className="text-sm italic text-[#444] leading-relaxed">
              &ldquo;{receipt.verdict}&rdquo;
            </p>
          </div>

          <div className="border-t border-dashed border-[#ccc] my-3" />

          {/* Could have shipped */}
          <div>
            <p className="text-xs text-[#999] uppercase tracking-wider text-center mb-2">
              Instead, you could have shipped
            </p>
            <ul className="space-y-1">
              {receipt.couldHaveShipped.map((item, i) => (
                <li
                  key={i}
                  className="text-sm text-[#444] flex items-start gap-2"
                >
                  <span className="text-red-500 mt-0.5">&#x2717;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-dashed border-[#ccc] my-4" />

          {/* Footer */}
          <div className="text-center text-xs text-[#999]">
            <p className="font-bold text-[#666] mb-1">meetingdebt.com</p>
            <p>This could have been an email.</p>
            <p className="mt-1">Thank you for your &ldquo;time&rdquo;.</p>
          </div>
        </div>

        {/* Torn bottom edge */}
        <div
          className="h-4 bg-[#faf6f0]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10px 15px, transparent 12px, #faf6f0 12px)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0",
          }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleCopyText}
          className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          Copy as text
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          Calculate another
        </button>
      </div>
    </div>
  );
}
