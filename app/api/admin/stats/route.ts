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
    return NextResponse.json(
      { error: "Unauthorized or server error" },
      { status: error.message === "Admin access required" ? 403 : 500 }
    )
  }
}