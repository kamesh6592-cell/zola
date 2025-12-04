import { isUserAdmin } from "@/lib/admin/auth"
import { AdminLayout } from "./components/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminPage() {
  const isAdmin = await isUserAdmin()

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6">
        <Card className="max-w-md bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2 text-white">Access Denied</h1>
            <p className="text-gray-300 mb-4">
              You don't have permission to access the admin panel.
            </p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="admin-page min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <AdminLayout />
    </div>
  )
}