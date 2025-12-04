import { MODEL_DEFAULT } from "@/lib/config"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import { createGuestServerClient } from "@/lib/supabase/server-guest"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/"

  console.log("Auth callback started:", { 
    url: requestUrl.toString(), 
    code: code ? "present" : "missing",
    supabaseEnabled: isSupabaseEnabled 
  })

  if (!isSupabaseEnabled) {
    console.error("Supabase is not enabled")
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/error?message=${encodeURIComponent("Supabase is not enabled in this deployment.")}`
    )
  }

  if (!code) {
    console.error("Missing authentication code")
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/error?message=${encodeURIComponent("Missing authentication code")}`
    )
  }

  try {
    // Create the server client which handles cookies properly
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/error?message=${encodeURIComponent("Supabase is not enabled in this deployment.")}`
      )
    }

    // Exchange code for session - this will set the auth cookies
    console.log("Attempting to exchange code for session")
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Auth exchange error:", error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`
      )
    }

    const user = data?.user
    if (!user || !user.id || !user.email) {
      console.error("Missing user info after auth exchange:", { user: user ? "present" : "missing", userId: user?.id, email: user?.email })
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Missing user info")}`
      )
    }

    console.log("Successfully authenticated user:", { userId: user.id, email: user.email })

    // Ensure user exists in database (using admin client to bypass RLS)
    try {
      const supabaseAdmin = await createGuestServerClient()
      
      if (supabaseAdmin) {
        console.log("Auth callback: Attempting to insert user", { userId: user.id, email: user.email })
        
        // First check if user already exists
        const { data: existingUser, error: checkError } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single()

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Error checking existing user:", checkError)
        }

        if (!existingUser) {
          // User doesn't exist, create new record
          const { data: insertData, error: insertError } = await supabaseAdmin.from("users").insert({
            id: user.id,
            email: user.email,
            display_name: user.user_metadata?.name || user.email.split('@')[0],
            profile_image: user.user_metadata?.avatar_url || null,
            created_at: new Date().toISOString(),
            message_count: 0,
            premium: false,
            anonymous: false,
            favorite_models: [MODEL_DEFAULT],
            daily_message_count: 0,
            daily_reset: null,
            last_active_at: new Date().toISOString(),
            daily_pro_message_count: 0,
            daily_pro_reset: null,
            system_prompt: null
          }).select()

          if (insertError) {
            console.error("Error inserting user:", insertError)
            // Only ignore duplicate key errors
            if (insertError.code !== "23505") {
              throw insertError
            }
          } else {
            console.log("Successfully inserted user:", insertData)
          }
        } else {
          console.log("User already exists in database:", existingUser)
        }
      } else {
        console.error("Failed to create admin Supabase client")
      }
    } catch (err) {
      console.error("Unexpected user insert error:", err)
      // Don't fail the login if user insert fails, but log it prominently
    }

    // Construct the redirect URL
    const host = request.headers.get("host")
    const protocol = host?.includes("localhost") ? "http" : "https"
    
    // Always redirect to home page after successful authentication
    // The next parameter might cause issues with user state loading
    const redirectUrl = `${protocol}://${host}/`

    console.log("Auth callback complete, redirecting to:", redirectUrl)
    
    // Redirect to home page
    return NextResponse.redirect(redirectUrl)
  } catch (err) {
    console.error("Unexpected auth callback error:", err)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Authentication failed")}`
    )
  }
}
