import { requireAdmin } from "@/lib/admin/auth"
import { getAllFeedback } from "@/lib/admin/api"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    
    const result = await getAllFeedback(page, limit)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Admin feedback error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Unauthorized or server error" },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}