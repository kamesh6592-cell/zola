import { requireAdmin } from "@/lib/admin/auth"
import { getAllUsers, updateUserStatus, deleteUser } from "@/lib/admin/api"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    
    const result = await getAllUsers(page, limit)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Admin users GET error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Unauthorized or server error" },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin()
    
    const { userId, premium } = await request.json()
    
    if (!userId || typeof premium !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      )
    }
    
    await updateUserStatus(userId, premium)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin users PUT error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Unauthorized or server error" },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin()
    
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }
    
    await deleteUser(userId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin users DELETE error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Unauthorized or server error" },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}