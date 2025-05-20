import { sql } from "@/lib/db"

export type SensorData = {
  id: number
  plantId: number
  moistureLevel: number | null
  npkNitrogen: number | null
  npkPhosphorus: number | null
  npkPotassium: number | null
  lightLevel: number | null
  temperature: number | null
  recordedAt: Date
}

export async function getLatestSensorData(plantId: number) {
  const data = await sql`
    SELECT id, plant_id as "plantId", moisture_level as "moistureLevel",
           npk_nitrogen as "npkNitrogen", npk_phosphorus as "npkPhosphorus", 
           npk_potassium as "npkPotassium", light_level as "lightLevel",
           temperature, recorded_at as "recordedAt"
    FROM sensor_data
    WHERE plant_id = ${plantId}
    ORDER BY recorded_at DESC
    LIMIT 1
  `

  return data.length > 0 ? (data[0] as SensorData) : null
}

export async function saveSensorData({
  plantId,
  moistureLevel,
  npkNitrogen,
  npkPhosphorus,
  npkPotassium,
  lightLevel,
  temperature,
}: {
  plantId: number
  moistureLevel?: number
  npkNitrogen?: number
  npkPhosphorus?: number
  npkPotassium?: number
  lightLevel?: number
  temperature?: number
}) {
  const data = await sql`
    INSERT INTO sensor_data (
      plant_id, moisture_level, npk_nitrogen, npk_phosphorus, 
      npk_potassium, light_level, temperature
    )
    VALUES (
      ${plantId}, ${moistureLevel || null}, ${npkNitrogen || null}, 
      ${npkPhosphorus || null}, ${npkPotassium || null}, 
      ${lightLevel || null}, ${temperature || null}
    )
    RETURNING id, plant_id as "plantId", moisture_level as "moistureLevel",
              npk_nitrogen as "npkNitrogen", npk_phosphorus as "npkPhosphorus", 
              npk_potassium as "npkPotassium", light_level as "lightLevel",
              temperature, recorded_at as "recordedAt"
  `

  return data[0] as SensorData
}
