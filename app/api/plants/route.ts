import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createPlant } from "@/lib/db/plants"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "ไม่ได้เข้าสู่ระบบ" }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const species = formData.get("species") as string
    const imageFile = formData.get("image") as File

    // Handle image upload (in a real app, you'd upload to a storage service)
    // For this example, we'll just use a placeholder URL
    const imageUrl = `/placeholder.svg?height=300&width=300`

    const plant = await createPlant({
      userId: session.user.id,
      name,
      species,
      imageUrl,
    })

    return NextResponse.json({ success: true, plant })
  } catch (error) {
    console.error("Create plant error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการเพิ่มต้นไม้" }, { status: 500 })
  }
}
