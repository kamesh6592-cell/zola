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
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Unauthorized or server error" },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}