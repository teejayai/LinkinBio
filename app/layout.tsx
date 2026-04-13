import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "LinkNest — Your digital story, one link at a time",
  description: "Create a stunning link-in-bio page that captures your unique identity. Customize themes, track analytics, and connect your audience.",
  keywords: ["link in bio", "creator tools", "portfolio", "social media", "landing page"],
  authors: [{ name: "LinkNest" }],
  openGraph: {
    title: "LinkNest — Your digital story, one link at a time",
    description: "Create a stunning link-in-bio page that captures your unique identity.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23c45d3e'/><text x='50' y='70' font-size='60' text-anchor='middle' fill='white' font-family='serif' font-style='italic'>L</text></svg>" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
