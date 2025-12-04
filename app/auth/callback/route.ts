import { isSupabaseEnabled } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  console.log("🚀 Auth callback started")

  if (!isSupabaseEnabled) {
    console.error("❌ Supabase is not enabled")
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent("Supabase is not enabled")}`
    )
  }

  if (!code) {
    console.error("❌ Missing authentication code")
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent("Missing authentication code")}`
    )
  }

  try {
    // Create the server client which handles cookies properly
    const supabase = await createClient()
    
    if (!supabase) {
      console.error("❌ Failed to create Supabase client")
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent("Authentication service unavailable")}`
      )
    }

    // Exchange code for session - this will set the auth cookies
    console.log("🔄 Exchanging code for session...")
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("❌ Auth exchange error:", error.message)
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`
      )
    }

    const user = data?.user
    if (!user?.id || !user?.email) {
      console.error("❌ Invalid user data after auth exchange")
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent("Invalid user data")}`
      )
    }

    console.log("✅ Successfully authenticated user:", user.email)

    // The database trigger will automatically create the user profile
    // No manual insertion needed - the trigger handles everything!
    
    // Construct redirect URL with auth success parameter
    const host = request.headers.get("host")
    const protocol = host?.includes("localhost") ? "http" : "https"
    const redirectUrl = `${protocol}://${host}/?auth=success`

    console.log("✅ Auth complete, redirecting to home page")
    
    // Redirect to home page with auth success flag
    return NextResponse.redirect(redirectUrl)
    
  } catch (err) {
    console.error("❌ Unexpected auth callback error:", err)
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=${encodeURIComponent("Authentication failed")}`
    )
  }
}
