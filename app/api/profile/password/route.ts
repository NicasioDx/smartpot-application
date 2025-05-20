import { type NextRequest, NextResponse } from "next/server"
import { getSession, validateUser } from "@/lib/auth"
import { updateUserPassword } from "@/lib/db/users"

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "ไม่ได้เข้าสู่ระบบ" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    // Validate current password
    const user = await validateUser(session.user.email, currentPassword)

    if (!user) {
      return NextResponse.json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" }, { status: 400 })
    }

    await updateUserPassword({
      userId: session.user.id,
      password: newPassword,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update password error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" }, { status: 500 })
  }
}
