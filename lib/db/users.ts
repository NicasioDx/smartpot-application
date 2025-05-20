import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export type UserProfile = {
  id: number
  email: string
  nickname: string | null
  birthDate: Date | null
}

export async function getUserProfile(userId: number) {
  const users = await sql`
    SELECT id, email, nickname, birth_date as "birthDate"
    FROM users
    WHERE id = ${userId}
  `

  return users.length > 0 ? (users[0] as UserProfile) : null
}

export async function updateUserProfile({
  userId,
  nickname,
  birthDate,
}: {
  userId: number
  nickname?: string
  birthDate?: Date | null
}) {
  const users = await sql`
    UPDATE users
    SET nickname = ${nickname || null}, 
        birth_date = ${birthDate || null},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
    RETURNING id, email, nickname, birth_date as "birthDate"
  `

  return users[0] as UserProfile
}

export async function updateUserPassword({
  userId,
  password,
}: {
  userId: number
  password: string
}) {
  const hashedPassword = await bcrypt.hash(password, 10)

  await sql`
    UPDATE users
    SET password = ${hashedPassword},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `

  return true
}
