import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, nickname, birthDate } = await request.json()

    const user = await createUser({
      email,
      password,
      nickname,
      birthDate: birthDate ? new Date(birthDate) : null,
    })

    const session = await createSession(user)

    cookies().set("session_token", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Registration error:", error)

    if ((error as any).code === "23505") {
      // Unique violation
      return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 409 })
    }

    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการลงทะเบียน" }, { status: 500 })
  }
}
