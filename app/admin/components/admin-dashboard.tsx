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
            <Card key={i} className="animate-pulse bg-gray-800/30 border-gray-700/50">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-600/50 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-600/50 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            System Overview
          </h1>
          <p className="text-gray-400 text-lg mt-1">Real-time monitoring and analytics</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 transition-all"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* System Health */}
      {health && (
        <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-green-400" />
              </div>
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 bg-black/20 rounded-lg border border-gray-700/30">
                <p className="text-sm font-medium text-gray-400 mb-2">Database</p>
                <p className={`text-xl font-bold ${health.database === "healthy" ? "text-green-400" : "text-red-400"}`}>
                  {health.database === "healthy" ? "✅ Healthy" : "❌ Error"}
                </p>
              </div>
              <div className="p-4 bg-black/20 rounded-lg border border-gray-700/30">
                <p className="text-sm font-medium text-gray-400 mb-2">Uptime</p>
                <p className="text-xl font-bold text-blue-400">{Math.floor(health.uptime / 3600)}h {Math.floor((health.uptime % 3600) / 60)}m</p>
              </div>
              <div className="p-4 bg-black/20 rounded-lg border border-gray-700/30">
                <p className="text-sm font-medium text-gray-400 mb-2">Memory</p>
                <p className="text-xl font-bold text-purple-400">NaNMB</p>
              </div>
              <div className="p-4 bg-black/20 rounded-lg border border-gray-700/30">
                <p className="text-sm font-medium text-gray-400 mb-2">Last Activity</p>
                <p className="text-xl font-bold text-yellow-400">
                  {health.lastActivity ? new Date(health.lastActivity).toLocaleTimeString() : "4:51:11 PM"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-700/50 hover:from-blue-900/60 hover:to-blue-800/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-blue-200">Total Users</CardTitle>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalUsers}</div>
              <p className="text-xs text-blue-300">
                {stats.authenticatedUsers} authenticated, {stats.anonymousUsers} anonymous
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-700/50 hover:from-green-900/60 hover:to-green-800/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-green-200">Total Messages</CardTitle>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalMessages}</div>
              <p className="text-xs text-green-300">
                Across {stats.totalChats} chats
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50 hover:from-purple-900/60 hover:to-purple-800/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-purple-200">Daily Active Users</CardTitle>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{stats.dailyActiveUsers}</div>
              <p className="text-xs text-purple-300">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-900/50 to-pink-800/30 border-pink-700/50 hover:from-pink-900/60 hover:to-pink-800/40 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-pink-200">User Feedback</CardTitle>
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Heart className="h-5 w-5 text-pink-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-2">{stats.totalFeedback}</div>
              <p className="text-xs text-pink-300">
                Total feedback received
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Requests */}
        {stats?.modelRequests && stats.modelRequests.length > 0 && (
          <Card className="bg-gray-800/40 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-yellow-400" />
                </div>
                Popular Model Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.modelRequests.slice(0, 10).map((request: { model: string; count: number }, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-gray-700/30">
                    <span className="text-sm text-white font-medium">{request.model}</span>
                    <span className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 text-xs px-3 py-1 rounded-full">
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
          <Card className="bg-gray-800/40 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-green-400" />
                </div>
                Most Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topUsers.slice(0, 10).map((user: { email: string; messageCount: number }, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-gray-700/30">
                    <span className="text-sm font-medium text-white">{user.email}</span>
                    <span className="text-sm text-gray-400">
                      {user.messageCount} messages
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}