import { createClient } from "@/lib/supabase/server"
import { createGuestServerClient } from "@/lib/supabase/server-guest"
import { MODEL_DEFAULT } from "@/lib/config"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Get current authenticated user
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not available" }, { status: 500 })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("Creating user profile for:", { userId: user.id, email: user.email })

    // Use admin client to create user profile
    const supabaseAdmin = await createGuestServerClient()
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin client not available" }, { status: 500 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    if (existingUser) {
      return NextResponse.json({ 
        message: "User already exists", 
        user: existingUser 
      })
    }

    // Create new user profile
    const { data: newUser, error: insertError } = await supabaseAdmin.from("users").insert({
      id: user.id,
      email: user.email!,
      display_name: user.user_metadata?.name || user.email!.split('@')[0],
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
    }).select().single()

    if (insertError) {
      console.error("Error creating user profile:", insertError)
      return NextResponse.json({ 
        error: "Failed to create user profile", 
        details: insertError 
      }, { status: 500 })
    }

    console.log("Successfully created user profile:", newUser)
    return NextResponse.json({ 
      message: "User profile created successfully", 
      user: newUser 
    })

  } catch (error) {
    console.error("Error creating user profile:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error 
    }, { status: 500 })
  }
}