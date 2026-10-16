import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "zabibu canary — the early-warning system for AI-made changes",
  description:
    "Every line your coding agent writes, reviewed before it ships. Plain-English risk, five-sector damage maps, and a signed receipt anyone can verify. A Zabibu Technika product, built by Tehillah Kachila.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* CRT scanlines — decorative, ignores the pointer */}
        <div className="scanlines" aria-hidden="true" />
      </body>
    </html>
  );
}
