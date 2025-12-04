import { requireAdmin } from "@/lib/admin/auth"
import { getSystemHealth } from "@/lib/admin/api"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await requireAdmin()
    
    const health = await getSystemHealth()
    
    return NextResponse.json(health)
  } catch (error) {
    console.error("Admin health error:", error)
    return NextResponse.json(
      { error: "Unauthorized or server error" },
      { status: error.message === "Admin access required" ? 403 : 500 }
    )
  }
}