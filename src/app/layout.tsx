import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meeting Debt | The True Cost of Your Meetings",
  description:
    "Calculate how much your meetings actually cost. Get a receipt. Feel the pain. Share it with your team.",
  metadataBase: new URL("https://meeting-debt.vercel.app"),
  openGraph: {
    title: "Meeting Debt | The True Cost of Your Meetings",
    description:
      "Calculate how much your meetings actually cost. Get a receipt. Feel the pain.",
    type: "website",
    images: ["/api/og?cost=847&attendees=8&duration=60&severity=brutal"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meeting Debt | The True Cost of Your Meetings",
    description:
      "Calculate how much your meetings actually cost. Get a receipt. Feel the pain.",
    images: ["/api/og?cost=847&attendees=8&duration=60&severity=brutal"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-white antialiased">{children}</body>
    </html>
  );
}
