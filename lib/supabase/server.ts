import { Database } from "@/app/types/database.types"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { isSupabaseEnabled } from "./config"

export const createClient = async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isSupabaseEnabled || !supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase server configuration missing:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      isEnabled: isSupabaseEnabled
    })
    return null
  }

  try {
    const cookieStore = await cookies()

    return createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // ignore for middleware
            }
          },
        },
      }
    )
  } catch (error) {
    console.error('Failed to create Supabase server client:', error)
    return null
  }
}
