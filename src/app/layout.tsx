import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meeting Debt | The True Cost of Your Meetings",
  description:
    "Calculate how much your meetings actually cost. Get a receipt. Feel the pain. Share it with your team.",
  openGraph: {
    title: "Meeting Debt | The True Cost of Your Meetings",
    description:
      "Calculate how much your meetings actually cost. Get a receipt. Feel the pain.",
    type: "website",
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
