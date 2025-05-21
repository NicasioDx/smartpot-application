const express = require("express")
const router = express.Router()
const { pool } = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// POST /api/register
router.post("/register", async (req, res) => {
  const { email, password, nickname } = req.body // เพิ่ม nickname ถ้ามี
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(
      "INSERT INTO users (email, password, nickname) VALUES ($1, $2, $3) RETURNING id, email, nickname",
      [email, hashedPassword, nickname || null]
    )
    res.status(201).json({ user: result.rows[0] })
  } catch (err) {
    console.error("Registration error:", err)
    res.status(500).json({ error: "Registration failed" })
  }
})

// POST /api/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if (result.rows.length === 0) return res.status(400).json({ error: "User not found" })

    const user = result.rows[0]
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: "Incorrect password" })

    // Payload ให้ตรงกับ middleware (ใช้ id และ email)
    const payload = { id: user.id, email: user.email }
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.json({ token, user: { id: user.id, email: user.email, nickname: user.nickname } })
  } catch (err) {
    console.error("🔥 Login error:", err)
    res.status(500).json({ error: "Login failed" })
  }
})

module.exports = router
