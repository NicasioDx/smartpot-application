// backend/routes/plantRoutes.js
const express = require("express")
const router = express.Router()
const { pool } = require("../db")
const { authenticateToken } = require("../middlewares/authMiddleware")

// User profile routes
router.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, email, nickname, birth_date FROM users WHERE id = $1", [req.user.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบผู้ใช้" })
    }

    const user = result.rows[0]

    res.json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      birthDate: user.birth_date,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์" })
  }
})

router.put("/api/profile", authenticateToken, async (req, res) => {
  try {
    const { nickname, birthDate } = req.body

    const result = await pool.query(
      "UPDATE users SET nickname = $1, birth_date = $2 WHERE id = $3 RETURNING id, email, nickname, birth_date",
      [nickname || null, birthDate ? new Date(birthDate) : null, req.user.id],
    )

    const user = result.rows[0]

    res.json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      birthDate: user.birth_date,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์" })
  }
})

module.exports = router