import {
  AUTH_DAILY_MESSAGE_LIMIT,
  DAILY_LIMIT_PRO_MODELS,
  NON_AUTH_DAILY_MESSAGE_LIMIT,
} from "@/lib/config"
import { validateUserIdentity } from "@/lib/server/api"

export async function getMessageUsage(
  userId: string,
  isAuthenticated: boolean
) {
  // For guest users, use localStorage-based tracking (no database lookup needed)
  if (!isAuthenticated) {
    const dailyLimit = NON_AUTH_DAILY_MESSAGE_LIMIT
    
    // Return default guest usage (actual tracking happens client-side)
    return {
      dailyCount: 0,
      dailyProCount: 0,
      dailyLimit,
      remaining: dailyLimit,
      remainingPro: DAILY_LIMIT_PRO_MODELS,
      count: 0, // For tracking reminders
    }
  }

  // For authenticated users, check database
  const supabase = await validateUserIdentity(userId, isAuthenticated)
  if (!supabase) return null

  const { data, error } = await supabase
    .from("users")
    .select("daily_message_count, daily_pro_message_count")
    .eq("id", userId)
    .maybeSingle()

  if (error || !data) {
    throw new Error(error?.message || "Failed to fetch message usage")
  }

  const dailyLimit = AUTH_DAILY_MESSAGE_LIMIT
  const dailyCount = data.daily_message_count || 0
  const dailyProCount = data.daily_pro_message_count || 0

  return {
    dailyCount,
    dailyProCount,
    dailyLimit,
    remaining: dailyLimit - dailyCount,
    remainingPro: DAILY_LIMIT_PRO_MODELS - dailyProCount,
    count: dailyCount,
  }
}
