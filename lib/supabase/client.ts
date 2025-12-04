import { Database } from "@/app/types/database.types"
import { createBrowserClient } from "@supabase/ssr"
import { isSupabaseEnabled } from "./config"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isSupabaseEnabled || !supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      isEnabled: isSupabaseEnabled
    })
    return null
  }

  try {
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}
