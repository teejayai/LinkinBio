import { LinkProfile, ThemePreset } from "@/lib/types";

export const themePresets: ThemePreset[] = [
  {
    id: "editorial",
    name: "Editorial",
    background: "#faf8f5",
    card: "#ffffff",
    accent: "#c45d3e",
    text: "#1a1a1a",
    muted: "#6b6b6b",
    font: "serif"
  },
  {
    id: "midnight",
    name: "Midnight",
    background: "#0d0d0d",
    card: "#1a1a1a",
    accent: "#e8c547",
    text: "#f5f5f5",
    muted: "#888888",
    font: "grotesk"
  },
  {
    id: "garden",
    name: "Garden",
    background: "#f4f1eb",
    card: "#ffffff",
    accent: "#2d5a47",
    text: "#1a2e1f",
    muted: "#5a6b5e",
    font: "serif"
  },
  {
    id: "digital",
    name: "Digital",
    background: "#0f1419",
    card: "#1a1f26",
    accent: "#00d4aa",
    text: "#e7e9ea",
    muted: "#71767b",
    font: "mono"
  },
  {
    id: "paper",
    name: "Paper",
    background: "#f5f2eb",
    card: "#fffdf7",
    accent: "#3d3d3d",
    text: "#1a1a1a",
    muted: "#6b6b6b",
    font: "serif"
  },
  {
    id: "sunset",
    name: "Sunset",
    background: "#1f1528",
    card: "#2c1f3d",
    accent: "#f97316",
    text: "#fef3e2",
    muted: "#c4b5a0",
    font: "serif"
  }
];

export const defaultProfile: LinkProfile = {
  username: "adeola",
  displayName: "Adeola Creates",
  bio: "Designer, educator, and storyteller sharing tools, workshops, and new drops.",
  avatar: "AC",
  themeId: "editorial",
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
