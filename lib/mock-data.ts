import { LinkProfile, ThemePreset } from "@/lib/types";

export const themePresets: ThemePreset[] = [
  {
    id: "lagoon",
    name: "Lagos Lagoon",
    background: "#f7f4ec",
    card: "#fffdf7",
    accent: "#0f766e",
    text: "#0f172a",
    muted: "#475569",
    font: "grotesk"
  },
  {
    id: "sunset",
    name: "Surulere Sunset",
    background: "#1f1631",
    card: "#2c1f43",
    accent: "#f97316",
    text: "#f8fafc",
    muted: "#cbd5e1",
    font: "serif"
  },
  {
    id: "market",
    name: "Market Grid",
    background: "#fbf7f1",
    card: "#ffffff",
    accent: "#a16207",
    text: "#18181b",
    muted: "#52525b",
    font: "mono"
  }
];

export const defaultProfile: LinkProfile = {
  username: "adeola",
  displayName: "Adeola Creates",
  bio: "Designer, educator, and storyteller sharing tools, workshops, and new drops.",
  avatar: "AC",
  themeId: "lagoon",
  views: 248,
  published: true,
  links: [
    {
      id: "link-1",
      title: "Book a Brand Session",
      url: "https://example.com/book",
      clicks: 86
    },
    {
      id: "link-2",
      title: "Watch My Latest Tutorial",
      url: "https://example.com/tutorial",
      clicks: 139
    },
    {
      id: "link-3",
      title: "Join My Weekly Newsletter",
      url: "https://example.com/newsletter",
      clicks: 57
    }
  ]
};
