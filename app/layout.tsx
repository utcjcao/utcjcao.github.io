import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chris Cao",
  description: "Personal website of Chris Cao, a CS student at U of T and incoming intern at Stripe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
