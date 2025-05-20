import { sql } from "@/lib/db"

export type Plant = {
  id: number
  userId: number
  name: string
  species: string | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export async function getUserPlants(userId: number) {
  const plants = await sql`
    SELECT id, user_id as "userId", name, species, image_url as "imageUrl", 
           created_at as "createdAt", updated_at as "updatedAt"
    FROM plants
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `

  return plants as Plant[]
}

export async function getPlantById(plantId: number, userId: number) {
  const plants = await sql`
    SELECT id, user_id as "userId", name, species, image_url as "imageUrl", 
           created_at as "createdAt", updated_at as "updatedAt"
    FROM plants
    WHERE id = ${plantId} AND user_id = ${userId}
  `

  return plants.length > 0 ? (plants[0] as Plant) : null
}

export async function createPlant({
  userId,
  name,
  species,
  imageUrl,
}: {
  userId: number
  name: string
  species?: string
  imageUrl?: string
}) {
  const plants = await sql`
    INSERT INTO plants (user_id, name, species, image_url)
    VALUES (${userId}, ${name}, ${species || null}, ${imageUrl || null})
    RETURNING id, user_id as "userId", name, species, image_url as "imageUrl", 
              created_at as "createdAt", updated_at as "updatedAt"
  `

  return plants[0] as Plant
}
