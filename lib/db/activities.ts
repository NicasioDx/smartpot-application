import { sql } from "@/lib/db"

export type PlantActivity = {
  id: number
  plantId: number
  activityType: string
  notes: string | null
  performedAt: Date
}

export async function getPlantActivities(plantId: number) {
  const activities = await sql`
    SELECT id, plant_id as "plantId", activity_type as "activityType", 
           notes, performed_at as "performedAt"
    FROM plant_activities
    WHERE plant_id = ${plantId}
    ORDER BY performed_at DESC
  `

  return activities as PlantActivity[]
}

export async function createPlantActivity({
  plantId,
  activityType,
  notes,
}: {
  plantId: number
  activityType: string
  notes?: string
}) {
  const activities = await sql`
    INSERT INTO plant_activities (plant_id, activity_type, notes)
    VALUES (${plantId}, ${activityType}, ${notes || null})
    RETURNING id, plant_id as "plantId", activity_type as "activityType", 
              notes, performed_at as "performedAt"
  `

  return activities[0] as PlantActivity
}
