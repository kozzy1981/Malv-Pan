import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Malvern Panalytical | Technical Exercise",
  description: "Product listing technical exercise for Malvern Panalytical.",
};

/** Provides the shared document shell for every App Router page. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
