import { supabase, isSupabaseConfigured } from "./supabase";
import { LinkProfile, LinkItem } from "./types";
import { themePresets } from "./mock-data";

const DEMO_STORAGE_KEY = "linknest-profile";

const defaultProfile: LinkProfile = {
  username: "",
  displayName: "",
  bio: "",
  avatar: "",
  themeId: "editorial",
  published: false,
  views: 0,
  links: []
};

export async function loadProfile(userId?: string): Promise<LinkProfile> {
  if (!isSupabaseConfigured || !supabase || !userId) {
    return loadDemoProfile();
  }

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error loading profile:", error);
      return { ...defaultProfile };
    }

    if (!profile) {
      return createProfile(userId);
    }

    const { data: links } = await supabase
      .from("links")
      .select("*")
      .eq("profile_id", profile.id)
      .order("position", { ascending: true });

    return {
      id: profile.id,
      user_id: profile.user_id,
      username: profile.username,
      displayName: profile.display_name,
      bio: profile.bio,
      avatar: profile.avatar,
      themeId: profile.theme_id,
      links: links || [],
      views: profile.views,
      published: profile.published,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };
  } catch (err) {
    console.error("Error loading profile:", err);
    return defaultProfile;
  }
}

async function createProfile(userId: string): Promise<LinkProfile> {
  if (!isSupabaseConfigured || !supabase) {
    return { ...defaultProfile };
  }

  try {
    console.log("Creating profile for user:", userId);
    
    const { data: profile, error } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        username: "",
        display_name: "",
        bio: "",
        avatar: "",
        theme_id: "editorial",
        published: false,
        views: 0,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("Insert error:", error);
      throw error;
    }

    if (!profile) {
      console.log("No profile returned, checking if trigger created one...");
      const { data: existing } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      
      if (existing) {
        return {
          id: existing.id,
          user_id: existing.user_id,
          username: existing.username,
          displayName: existing.display_name,
          bio: existing.bio,
          avatar: existing.avatar,
          themeId: existing.theme_id,
          links: [],
          views: existing.views,
          published: existing.published,
          created_at: existing.created_at,
          updated_at: existing.updated_at,
        };
      }
      throw new Error("Failed to create or find profile");
    }

    return {
      id: profile.id,
      user_id: profile.user_id,
      username: profile.username,
      displayName: profile.display_name,
      bio: profile.bio,
      avatar: profile.avatar,
      themeId: profile.theme_id,
      links: [],
      views: profile.views,
      published: profile.published,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };
  } catch (err) {
    console.error("Error creating profile:", err);
    return { ...defaultProfile, user_id: userId };
  }
}

export async function saveProfile(profile: LinkProfile): Promise<void> {
  if (!isSupabaseConfigured || !supabase || !profile.user_id) {
    saveDemoProfile(profile);
    return;
  }

  try {
    console.log("Saving profile to Supabase:", { username: profile.username, published: profile.published, user_id: profile.user_id });

    const { data: updateData, error: updateError } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        display_name: profile.displayName,
        bio: profile.bio,
        avatar: profile.avatar,
        theme_id: profile.themeId,
        published: profile.published,
        views: profile.views,
      })
      .eq("user_id", profile.user_id)
      .select();

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw updateError;
    }

    console.log("Profile updated successfully:", updateData);

    const { data: existingLinks } = await supabase
      .from("links")
      .select("id")
      .eq("profile_id", profile.id);

    const existingIds = new Set(existingLinks?.map((l) => l.id) || []);
    const newIds = new Set(profile.links.map((l) => l.id));

    const toDelete = [...existingIds].filter((id) => !newIds.has(id));
    if (toDelete.length > 0) {
      for (const id of toDelete) {
        await supabase.from("links").delete().eq("id", id);
      }
    }

    for (let i = 0; i < profile.links.length; i++) {
      const link = profile.links[i];
      if (existingIds.has(link.id)) {
        await supabase
          .from("links")
          .update({
            title: link.title,
            url: link.url,
            clicks: link.clicks,
            position: i,
          })
          .eq("id", link.id);
      } else {
        await supabase.from("links").insert({
          profile_id: profile.id,
          title: link.title,
          url: link.url,
          clicks: link.clicks,
          position: i,
        });
      }
    }
  } catch (err) {
    console.error("Error saving profile:", err);
  }
}

export async function getPublicProfile(username: string): Promise<LinkProfile | null> {
  if (!isSupabaseConfigured || !supabase) {
    return getDemoPublicProfile(username);
  }

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .eq("published", true)
      .maybeSingle();

    if (error) {
      console.error("Error fetching public profile:", error);
      return null;
    }

    if (!profile) return null;

    const { data: links } = await supabase
      .from("links")
      .select("*")
      .eq("profile_id", profile.id)
      .order("position", { ascending: true });

    await supabase
      .from("profiles")
      .update({ views: profile.views + 1 })
      .eq("id", profile.id);

    return {
      id: profile.id,
      user_id: profile.user_id,
      username: profile.username,
      displayName: profile.display_name,
      bio: profile.bio,
      avatar: profile.avatar,
      themeId: profile.theme_id,
      links: links || [],
      views: profile.views + 1,
      published: profile.published,
    };
  } catch (err) {
    console.error("Error loading public profile:", err);
    return null;
  }
}

function loadDemoProfile(): LinkProfile {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  try {
    return JSON.parse(raw) as LinkProfile;
  } catch {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }
}

function saveDemoProfile(profile: LinkProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(profile));
}

function getDemoPublicProfile(username: string): LinkProfile | null {
  const profile = loadDemoProfile();
  if (profile.username === username && profile.published) {
    return profile;
  }
  return null;
}

export { defaultProfile, themePresets };