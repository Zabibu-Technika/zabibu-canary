import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "zabibu canary — the safety check for AI-made changes",
  description:
    "Check any change your AI made, in plain English, before it goes live. Approve with one click and get a tamper-proof receipt. A Zabibu Technika product, built by Tehillah Kachila.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
