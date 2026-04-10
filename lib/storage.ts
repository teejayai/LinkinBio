import { defaultProfile } from "@/lib/mock-data";
import { LinkProfile } from "@/lib/types";

const STORAGE_KEY = "linknest-profile";

export function loadProfile(): LinkProfile {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  try {
    return JSON.parse(raw) as LinkProfile;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }
}

export function saveProfile(profile: LinkProfile) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
