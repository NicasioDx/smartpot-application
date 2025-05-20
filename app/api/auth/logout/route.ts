import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const sessionToken = cookies().get("session_token")?.value

    if (sessionToken) {
      await deleteSession(sessionToken)
    }

    cookies().delete("session_token")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการออกจากระบบ" }, { status: 500 })
  }
}
