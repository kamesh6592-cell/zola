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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">AJ CHAT Admin Panel</h1>
            <span className="text-sm text-muted-foreground ml-2">
              Admin Access for kamesh6592@gmail.com
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="bg-white border-b sticky top-0 z-10">
            <div className="px-6">
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex items-center gap-2">
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