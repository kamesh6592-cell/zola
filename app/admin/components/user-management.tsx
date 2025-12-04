"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { fetchClient } from "@/lib/fetch"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Trash2, Crown, User, Search } from "lucide-react"
import { toast } from "@/components/ui/toast"

interface User {
  id: string
  email: string
  display_name?: string
  created_at: string
  last_active_at?: string
  message_count: number
  premium: boolean
  anonymous: boolean
}

interface UsersResponse {
  users: User[]
  total: number
}

export function UserManagement() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery<UsersResponse>({
    queryKey: ["admin-users", page],
    queryFn: async () => {
      const response = await fetchClient(`/api/admin/users?page=${page}&limit=20`)
      if (!response.ok) throw new Error("Failed to fetch users")
      return response.json()
    }
  })

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, premium }: { userId: string; premium: boolean }) => {
      const response = await fetchClient("/api/admin/users", {
        method: "PUT",
        body: JSON.stringify({ userId, premium }),
        headers: { "Content-Type": "application/json" }
      })
      if (!response.ok) throw new Error("Failed to update user")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      toast({ title: "User updated successfully" })
    },
    onError: () => {
      toast({ title: "Failed to update user", status: "error" })
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetchClient("/api/admin/users", {
        method: "DELETE",
        body: JSON.stringify({ userId }),
        headers: { "Content-Type": "application/json" }
      })
      if (!response.ok) throw new Error("Failed to delete user")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] })
      toast({ title: "User deleted successfully" })
    },
    onError: () => {
      toast({ title: "Failed to delete user", status: "error" })
    }
  })

  const filteredUsers = data?.users?.filter((user: User) =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.display_name?.toLowerCase().includes(search.toLowerCase())
  ) || []

  const totalPages = Math.ceil((data?.total || 0) / 20)

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading users: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users and permissions</p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Users ({data?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 border rounded">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user: User) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.email}</span>
                      {user.premium && <Crown className="h-4 w-4 text-yellow-500" />}
                      {user.anonymous && <Badge variant="secondary">Anonymous</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.display_name && <span>{user.display_name} • </span>}
                      {user.message_count} messages • 
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last active: {user.last_active_at ? new Date(user.last_active_at).toLocaleString() : "Never"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={user.premium ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateUserMutation.mutate({ 
                        userId: user.id, 
                        premium: !user.premium 
                      })}
                      disabled={updateUserMutation.isPending}
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      {user.premium ? "Remove Pro" : "Make Pro"}
                    </Button>
                    
                    {!user.anonymous && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${user.email}?`)) {
                            deleteUserMutation.mutate(user.id)
                          }
                        }}
                        disabled={deleteUserMutation.isPending}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}