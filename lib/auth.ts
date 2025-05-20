import { cookies } from "next/headers"
import { sql } from "@/lib/db"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export type User = {
  id: number
  email: string
  nickname: string | null
  birthDate: Date | null
}

export type Session = {
  token: string
  user: User
}

export async function createUser({
  email,
  password,
  nickname,
  birthDate,
}: {
  email: string
  password: string
  nickname?: string | null
  birthDate?: Date | null
}) {
  const hashedPassword = await bcrypt.hash(password, 10)

  const result = await sql`
    INSERT INTO users (email, password, nickname, birth_date)
    VALUES (${email}, ${hashedPassword}, ${nickname || null}, ${birthDate || null})
    RETURNING id, email, nickname, birth_date as "birthDate"
  `

  return result[0] as User
}

export async function validateUser(email: string, password: string) {
  const users = await sql`
    SELECT id, email, password, nickname, birth_date as "birthDate"
    FROM users
    WHERE email = ${email}
  `

  if (users.length === 0) {
    return null
  }

  const user = users[0]
  const passwordValid = await bcrypt.compare(password, user.password)

  if (!passwordValid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    birthDate: user.birthDate,
  } as User
}

export async function createSession(user: User) {
  const token = crypto.randomBytes(32).toString("hex")

  // In a real app, you'd store sessions in the database
  // For this example, we'll just return the token and user

  return {
    token,
    user,
  }
}

export async function getSession(): Promise<Session | null> {
  const sessionToken = cookies().get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  // In a real app, you'd validate the token against the database
  // For this example, we'll just return a mock session

  return {
    token: sessionToken,
    user: {
      id: 1,
      email: "user@example.com",
      nickname: "Plant Lover",
      birthDate: new Date("1990-01-01"),
    },
  }
}

export async function deleteSession(token: string) {
  // In a real app, you'd delete the session from the database
  // For this example, we'll just return true
  return true
}
