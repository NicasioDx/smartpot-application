import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getPlantById } from "@/lib/db/plants"
import { createPlantActivity } from "@/lib/db/activities"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "ไม่ได้เข้าสู่ระบบ" }, { status: 401 })
    }

    const plantId = Number.parseInt(params.id)
    const plant = await getPlantById(plantId, session.user.id)

    if (!plant) {
      return NextResponse.json({ error: "ไม่พบต้นไม้" }, { status: 404 })
    }

    // Create watering activity
    await createPlantActivity({
      plantId,
      activityType: "watering",
      notes: "รดน้ำต้นไม้",
    })

    // In a real app, you might send a command to the IoT device here

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Water plant error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการรดน้ำต้นไม้" }, { status: 500 })
  }
}
