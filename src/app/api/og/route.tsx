import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const cost = searchParams.get("cost") || "847";
  const attendees = searchParams.get("attendees") || "8";
  const duration = searchParams.get("duration") || "60";
  const severity = searchParams.get("severity") || "painful";

  const severityColor =
    severity === "catastrophic"
      ? "#dc2626"
      : severity === "brutal"
      ? "#ef4444"
      : severity === "painful"
      ? "#f97316"
      : "#ca8a04";

  const severityLabel =
    severity === "catastrophic"
      ? "CATASTROPHIC"
      : severity === "brutal"
      ? "BRUTAL"
      : severity === "painful"
      ? "PAINFUL"
      : "MINOR DAMAGE";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "Courier New, monospace",
        }}
      >
        {/* Receipt card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#faf6f0",
            borderRadius: "4px",
            padding: "40px 60px",
            maxWidth: "700px",
            width: "700px",
          }}
        >
          {/* Header */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "4px",
              color: "#1a1a1a",
              display: "flex",
            }}
          >
            MEETING DEBT
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#999",
              letterSpacing: "3px",
              marginTop: "4px",
              display: "flex",
            }}
          >
            OFFICIAL RECEIPT OF WASTED POTENTIAL
          </div>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              borderTop: "2px dashed #ccc",
              marginTop: "20px",
              marginBottom: "20px",
              display: "flex",
            }}
          />

          {/* Stats */}
          <div
            style={{
              fontSize: "16px",
              color: "#666",
              display: "flex",
              gap: "20px",
            }}
          >
            <span>{attendees} attendees</span>
            <span>·</span>
            <span>{duration} minutes</span>
          </div>

          {/* Big cost */}
          <div
            style={{
              fontSize: "80px",
              fontWeight: 900,
              color: "#1a1a1a",
              marginTop: "16px",
              display: "flex",
            }}
          >
            ${Number(cost).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          {/* Severity badge */}
          <div
            style={{
              display: "flex",
              marginTop: "20px",
              padding: "8px 24px",
              borderRadius: "999px",
              border: `3px solid ${severityColor}`,
              color: severityColor,
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "3px",
            }}
          >
            {severityLabel}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              borderTop: "2px dashed #ccc",
              marginTop: "20px",
              marginBottom: "12px",
              display: "flex",
            }}
          />

          {/* Footer */}
          <div
            style={{
              fontSize: "14px",
              color: "#999",
              display: "flex",
            }}
          >
            This could have been an email. · meetingdebt.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
