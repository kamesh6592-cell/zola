"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminDashboard } from "./admin-dashboard"
import { UserManagement } from "./user-management"
import { FeedbackManagement } from "./feedback-management"
import { Card } from "@/components/ui/card"
import { Shield, Users, MessageSquare, BarChart3 } from "lucide-react"

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-black/20 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MEOW CHAT Admin Panel</h1>
                <span className="text-sm text-gray-400">
                  Admin Access for kamesh6592@gmail.com
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="bg-black/10 border-b border-gray-700/50 sticky top-0 z-10 backdrop-blur-sm">
            <div className="px-6 py-3">
              <TabsList className="grid w-full max-w-lg grid-cols-3 bg-gray-800/50 border border-gray-700/50">
                <TabsTrigger 
                  value="dashboard" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/50 text-gray-300 hover:text-white transition-all"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/50 text-gray-300 hover:text-white transition-all"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="feedback" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-400 data-[state=active]:border-blue-500/50 text-gray-300 hover:text-white transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Feedback</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="dashboard" className="m-0">
            <AdminDashboard />
          </TabsContent>
          
          <TabsContent value="users" className="m-0">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="feedback" className="m-0">
            <FeedbackManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}