import { isSupabaseEnabled } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import {
  convertFromApiFormat,
  defaultPreferences,
} from "@/lib/user-preference-store/utils"
import type { UserProfile } from "./types"

export async function getSupabaseUser() {
  const supabase = await createClient()
  if (!supabase) return { supabase: null, user: null }

  const { data } = await supabase.auth.getUser()
  return {
    supabase,
    user: data.user ?? null,
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  if (!isSupabaseEnabled) {
    // return fake user profile for no supabase
    return {
      id: "guest",
      email: "guest@meow.chat",
      display_name: "Guest",
      profile_image: "",
      anonymous: true,
      preferences: defaultPreferences,
    } as UserProfile
  }

  const { supabase, user } = await getSupabaseUser()
  if (!supabase || !user) return null

  try {
    const { data: userProfileData } = await supabase
      .from("users")
      .select("*, user_preferences(*)")
      .eq("id", user.id)
      .single()

    // Don't load anonymous users in the user store
    if (userProfileData?.anonymous) return null

    // If user exists in database, return their profile
    if (userProfileData) {
      const formattedPreferences = userProfileData?.user_preferences
        ? convertFromApiFormat(userProfileData.user_preferences)
        : undefined

      return {
        ...userProfileData,
        profile_image: user.user_metadata?.avatar_url ?? "",
        display_name: user.user_metadata?.name ?? "",
        preferences: formattedPreferences,
      } as UserProfile
    }

    // If user doesn't exist in database but is authenticated, create a basic profile
    // This handles the case where user successfully authenticated but wasn't inserted properly
    if (user.email) {
      return {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.name ?? user.email.split('@')[0],
        profile_image: user.user_metadata?.avatar_url ?? "",
        anonymous: false,
        preferences: defaultPreferences,
        created_at: new Date().toISOString(),
        message_count: 0,
        premium: false,
        favorite_models: [],
        daily_message_count: 0,
        daily_reset: null,
        last_active_at: null,
        daily_pro_message_count: 0,
        daily_pro_reset: null,
        system_prompt: null
      } as UserProfile
    }

    return null
  } catch (error) {
    console.error("Error fetching user profile:", error)
    
    // Fallback: if there's an error but user is authenticated, return basic profile
    if (user.email) {
      return {
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.name ?? user.email.split('@')[0],
        profile_image: user.user_metadata?.avatar_url ?? "",
        anonymous: false,
        preferences: defaultPreferences,
        created_at: new Date().toISOString(),
        message_count: 0,
        premium: false,
        favorite_models: [],
        daily_message_count: 0,
        daily_reset: null,
        last_active_at: null,
        daily_pro_message_count: 0,
        daily_pro_reset: null,
        system_prompt: null
      } as UserProfile
    }
    
    return null
  }
}
