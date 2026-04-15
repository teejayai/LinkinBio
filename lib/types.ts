export type FontStyle = "grotesk" | "serif" | "mono";

export type ThemePreset = {
  id: string;
  name: string;
  background: string;
  card: string;
  accent: string;
  text: string;
  muted: string;
  font: FontStyle;
};

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  clicks: number;
  created_at?: string;
};

export type LinkProfile = {
  id?: string;
  user_id?: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  themeId: string;
  links: LinkItem[];
  views: number;
  published: boolean;
  created_at?: string;
  updated_at?: string;
};
