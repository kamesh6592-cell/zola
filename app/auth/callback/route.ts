import { MODEL_DEFAULT } from "@/lib/config"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import { createGuestServerClient } from "@/lib/supabase/server-guest"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/"

  if (!isSupabaseEnabled) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/error?message=${encodeURIComponent("Supabase is not enabled in this deployment.")}`
    )
  }

  if (!code) {
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
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Auth error:", error)
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`
      )
    }

    const user = data?.user
    if (!user || !user.id || !user.email) {
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Missing user info")}`
      )
    }

    // Try to insert user only if not exists (using admin client to bypass RLS)
    try {
      const supabaseAdmin = await createGuestServerClient()
      
      if (supabaseAdmin) {
        const { error: insertError } = await supabaseAdmin.from("users").insert({
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
          message_count: 0,
          premium: false,
          favorite_models: [MODEL_DEFAULT],
        })

        // Ignore duplicate key errors (user already exists)
        if (insertError && insertError.code !== "23505") {
          console.error("Error inserting user:", insertError)
        }
      }
    } catch (err) {
      console.error("Unexpected user insert error:", err)
      // Don't fail the login if user insert fails
    }

    // Construct the redirect URL
    const host = request.headers.get("host")
    const protocol = host?.includes("localhost") ? "http" : "https"
    
    // Always redirect to home page after successful authentication
    // The next parameter might cause issues with user state loading
    const redirectUrl = `${protocol}://${host}/`

    // Redirect to home page
    return NextResponse.redirect(redirectUrl)
  } catch (err) {
    console.error("Unexpected auth callback error:", err)
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?error=${encodeURIComponent("Authentication failed")}`
    )
  }
}
