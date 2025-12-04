import { createClient } from "@/lib/supabase/server"

export interface AdminStats {
  totalUsers: number
  authenticatedUsers: number
  anonymousUsers: number
  totalChats: number
  totalMessages: number
  totalFeedback: number
  dailyActiveUsers: number
  modelRequests: { model: string; count: number }[]
  topUsers: { email: string; messageCount: number; chatCount: number }[]
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient()
  if (!supabase) throw new Error("Database not available")

  // Get user stats
  const { data: userStats } = await supabase
    .from("users")
    .select("id, email, anonymous, message_count, created_at, last_active_at")

  const totalUsers = userStats?.length || 0
  const authenticatedUsers = userStats?.filter(u => !u.anonymous).length || 0
  const anonymousUsers = totalUsers - authenticatedUsers

  // Get daily active users (last 24 hours)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  const dailyActiveUsers = userStats?.filter(u => 
    u.last_active_at && new Date(u.last_active_at) > yesterday
  ).length || 0

  // Get chat count
  const { count: totalChats } = await supabase
    .from("chats")
    .select("*", { count: "exact", head: true })

  // Get message count
  const { count: totalMessages } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })

  // Get feedback count
  const { count: totalFeedback } = await supabase
    .from("feedback")
    .select("*", { count: "exact", head: true })

  // Get model access requests
  const { data: feedbackData } = await supabase
    .from("feedback")
    .select("message")
    .like("message", "I want access to%")

  const modelRequests = feedbackData?.reduce((acc: any[], item) => {
    const model = item.message.replace("I want access to ", "")
    const existing = acc.find(r => r.model === model)
    if (existing) {
      existing.count++
    } else {
      acc.push({ model, count: 1 })
    }
    return acc
  }, []).sort((a, b) => b.count - a.count) || []

  // Get top users by activity
  const topUsers = userStats
    ?.filter(u => !u.anonymous && (u.message_count ?? 0) > 0)
    .sort((a, b) => (b.message_count ?? 0) - (a.message_count ?? 0))
    .slice(0, 10)
    .map(u => ({
      email: u.email,
      messageCount: u.message_count ?? 0,
      chatCount: 0 // We'll get this separately if needed
    })) || []

  return {
    totalUsers,
    authenticatedUsers,
    anonymousUsers,
    totalChats: totalChats || 0,
    totalMessages: totalMessages || 0,
    totalFeedback: totalFeedback || 0,
    dailyActiveUsers,
    modelRequests,
    topUsers
  }
}

export async function getAllUsers(page = 1, limit = 50) {
  const supabase = await createClient()
  if (!supabase) throw new Error("Database not available")

  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from("users")
    .select(`
      id, email, display_name, created_at, last_active_at,
      message_count, premium, anonymous, favorite_models,
      daily_message_count, daily_reset
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return { users: data || [], total: count || 0 }
}

export async function updateUserStatus(userId: string, premium: boolean) {
  const supabase = await createClient()
  if (!supabase) throw new Error("Database not available")

  const { error } = await supabase
    .from("users")
    .update({ premium })
    .eq("id", userId)

  if (error) throw error
}

export async function deleteUser(userId: string) {
  const supabase = await createClient()
  if (!supabase) throw new Error("Database not available")

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId)

  if (error) throw error
}

export async function getAllFeedback(page = 1, limit = 50) {
  const supabase = await createClient()
  if (!supabase) throw new Error("Database not available")

  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from("feedback")
    .select(`
      id, message, created_at,
      users!inner(email, display_name)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return { feedback: data || [], total: count || 0 }
}

export async function getSystemHealth() {
  const supabase = await createClient()
  if (!supabase) throw new Error("Database not available")

  // Check database connection
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .limit(1)

  const dbStatus = error ? "error" : "healthy"

  // Get recent error logs (if any)
  const { data: recentMessages } = await supabase
    .from("messages")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)

  const lastActivity = recentMessages?.[0]?.created_at || null

  return {
    database: dbStatus,
    lastActivity,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  }
}