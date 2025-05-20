import { type NextRequest, NextResponse } from "next/server"
import { saveSensorData } from "@/lib/db/sensor-data"

export async function POST(request: NextRequest) {
  try {
    // In a real app, you'd validate the request with an API key or other auth method
    const { plantId, moisture, nitrogen, phosphorus, potassium, light, temperature } = await request.json()

    await saveSensorData({
      plantId: Number.parseInt(plantId),
      moistureLevel: Number.parseFloat(moisture),
      npkNitrogen: Number.parseFloat(nitrogen),
      npkPhosphorus: Number.parseFloat(phosphorus),
      npkPotassium: Number.parseFloat(potassium),
      lightLevel: Number.parseFloat(light),
      temperature: Number.parseFloat(temperature),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Save sensor data error:", error)
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูลเซ็นเซอร์" }, { status: 500 })
  }
}
