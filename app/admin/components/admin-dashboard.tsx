"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchClient } from "@/lib/fetch"
import { Users, MessageSquare, Heart, Activity } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

interface AdminStats {
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

interface SystemHealth {
  database: string
  lastActivity: string | null
  uptime: number
  memory: { used: number }
}

export function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false)

  const { data: stats, isLoading, refetch } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await fetchClient("/api/admin/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")
      return response.json()
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  const { data: health } = useQuery<SystemHealth>({
    queryKey: ["admin-health"],
    queryFn: async () => {
      const response = await fetchClient("/api/admin/health")
      if (!response.ok) throw new Error("Failed to fetch health")
      return response.json()
    },
    refetchInterval: 10000 // Refresh every 10 seconds
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">AJ CHAT System Overview</p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* System Health */}
      {health && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium">Database</p>
                <p className={`text-lg ${health.database === "healthy" ? "text-green-600" : "text-red-600"}`}>
                  {health.database === "healthy" ? "✅ Healthy" : "❌ Error"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Uptime</p>
                <p className="text-lg">{Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m</p>
              </div>
              <div>
                <p className="text-sm font-medium">Memory</p>
                <p className="text-lg">{Math.round(health.memory.used / 1024 / 1024)}MB</p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Activity</p>
                <p className="text-lg">
                  {health.lastActivity ? new Date(health.lastActivity).toLocaleTimeString() : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.authenticatedUsers} authenticated, {stats.anonymousUsers} anonymous
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                Across {stats.totalChats} chats
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dailyActiveUsers}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Feedback</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFeedback}</div>
              <p className="text-xs text-muted-foreground">
                Total feedback received
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Model Requests */}
      {stats?.modelRequests && stats.modelRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Model Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.modelRequests.slice(0, 10).map((request: { model: string; count: number }, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{request.model}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {request.count} requests
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Users */}
      {stats?.topUsers && stats.topUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Most Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topUsers.slice(0, 10).map((user: { email: string; messageCount: number }, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{user.email}</span>
                  <span className="text-sm text-muted-foreground">
                    {user.messageCount} messages
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}