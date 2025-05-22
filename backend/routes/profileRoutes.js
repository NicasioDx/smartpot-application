// backend/routes/profileRoutes.js
const express = require("express")
const router = express.Router()
const { pool } = require("../db")
const { authenticateToken } = require("../middlewares/authMiddleware")

// User profile routes
router.get("/", authenticateToken, async (req, res) => {
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

router.put("/", authenticateToken, async (req, res) => {
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

// PUT /api/profile/password
router.put("/password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "กรุณากรอกรหัสผ่านให้ครบถ้วน" })
  }

  try {
    // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const result = await pool.query("SELECT id, password FROM users WHERE id = $1", [req.user.id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบผู้ใช้" })
    }

    const user = result.rows[0]

    // ตรวจสอบรหัสผ่านปัจจุบัน
    const bcrypt = require("bcrypt")
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" })
    }

    // แฮชรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // อัปเดตรหัสผ่านในฐานข้อมูล
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, req.user.id])

    res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" })
  } catch (error) {
    console.error("Update password error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" })
  }
})

module.exports = router