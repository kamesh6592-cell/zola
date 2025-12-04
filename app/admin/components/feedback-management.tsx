"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchClient } from "@/lib/fetch"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { MessageSquare, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeedbackItem {
  id: string
  message: string
  created_at: string
  users: {
    email: string
    display_name?: string
  }
}

interface FeedbackResponse {
  feedback: FeedbackItem[]
  total: number
}

export function FeedbackManagement() {
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery<FeedbackResponse>({
    queryKey: ["admin-feedback", page],
    queryFn: async () => {
      const response = await fetchClient(`/api/admin/feedback?page=${page}&limit=20`)
      if (!response.ok) throw new Error("Failed to fetch feedback")
      return response.json()
    }
  })

  const totalPages = Math.ceil((data?.total || 0) / 20)

  const isModelRequest = (message: string) => 
    message.startsWith("I want access to")

  const getRequestedModel = (message: string) =>
    message.replace("I want access to ", "")

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Error loading feedback: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Feedback</h1>
          <p className="text-muted-foreground">Monitor user feedback and model requests</p>
        </div>
      </div>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Feedback ({data?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="animate-pulse p-4 border rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data?.feedback?.map((item: FeedbackItem) => (
                <div key={item.id} className="p-4 border rounded hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.users.email}</span>
                      {item.users.display_name && (
                        <span className="text-sm text-muted-foreground">
                          ({item.users.display_name})
                        </span>
                      )}
                      {isModelRequest(item.message) && (
                        <Badge variant="outline" className="bg-blue-50">
                          Model Request
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    {isModelRequest(item.message) ? (
                      <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-200">
                        <div className="font-medium text-blue-800">
                          Requesting access to: <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                            {getRequestedModel(item.message)}
                          </code>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="whitespace-pre-wrap">{item.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {data?.feedback?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No feedback received yet</p>
                </div>
              )}
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