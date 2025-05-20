import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { updateUserProfile } from "@/lib/db/users"

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "ไม่ได้เข้าสู่ระบบ" }, { status: 401 })
    }

    const { nickname, birthDate } = await request.json()

    const profile = await updateUserProfile({
      userId: session.user.id,
      nickname,
      birthDate: birthDate ? new Date(birthDate) : null,
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์" }, { status: 500 })
  }
}
