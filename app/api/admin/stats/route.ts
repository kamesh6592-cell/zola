import { requireAdmin } from "@/lib/admin/auth"
import { getAdminStats } from "@/lib/admin/api"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await requireAdmin()
    
    const stats = await getAdminStats()
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Admin stats error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Unauthorized or server error" },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}