import { createClient } from "@/lib/supabase/server"
import { createGuestServerClient } from "@/lib/supabase/server-guest"
import { isSupabaseEnabled } from "../supabase/config"

/**
 * Validates the user's identity
 * @param userId - The ID of the user.
 * @param isAuthenticated - Whether the user is authenticated.
 * @returns The Supabase client.
 */
export async function validateUserIdentity(
  userId: string,
  isAuthenticated: boolean
) {
  if (!isSupabaseEnabled) {
    return null
  }

  const supabase = isAuthenticated
    ? await createClient()
    : await createGuestServerClient()

  if (!supabase) {
    throw new Error("Failed to initialize Supabase client")
  }

  if (isAuthenticated) {
    const { data: authData, error: authError } = await supabase.auth.getUser()

    if (authError || !authData?.user?.id) {
      throw new Error("Unable to get authenticated user")
    }

    if (authData.user.id !== userId) {
      throw new Error("User ID does not match authenticated user")
    }

    // With the new database trigger, users are automatically created
    // Just verify the user exists, and if not, wait a moment for the trigger to complete
    try {
      let retries = 0
      const maxRetries = 3
      
      while (retries < maxRetries) {
        const { data: userExists, error: checkError } = await supabase
          .from("users")
          .select("id")
          .eq("id", authData.user.id)
          .single()

        if (userExists) {
          break // User found, we're good!
        }

        if (checkError && checkError.code === "PGRST116" && retries < maxRetries - 1) {
          // User not found yet, wait a bit for the trigger to complete
          console.log(`User not found, retrying... (${retries + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 500))
          retries++
          continue
        }

        if (checkError && checkError.code === "PGRST116") {
          console.error("User still not found after retries:", authData.user.id)
          throw new Error("User profile not ready yet. Please refresh the page.")
        }

        if (checkError) {
          console.error("Error checking user existence:", checkError)
          throw new Error("Unable to verify user account")
        }
      }
    } catch (err) {
      console.error("Error in user validation:", err)
      throw err
    }
  } else {
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .eq("anonymous", true)
      .maybeSingle()

    if (userError || !userRecord) {
      throw new Error("Invalid or missing guest user")
    }
  }

  return supabase
}
