import { ADMIN_EMAILS } from "@/lib/config"
import { createClient } from "@/lib/supabase/server"

export async function isUserAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    if (!supabase) return false

    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return false

    return ADMIN_EMAILS.includes(user.email)
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

export async function requireAdmin() {
  const isAdmin = await isUserAdmin()
  if (!isAdmin) {
    throw new Error("Admin access required")
  }
}