import { getUserProfile } from "@/lib/user/api"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const userProfile = await getUserProfile()
    
    if (!userProfile) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}