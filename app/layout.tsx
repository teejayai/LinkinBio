import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "LinkNest",
  description: "Customizable link-in-bio pages for creators with built-in analytics."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
