import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Trade Copilot — Autonomous Trade-Safety Agent",
  description:
    "An autonomous AI agent with a non-overridable deterministic safety core. Powered by OKX onchainOS on X Layer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
