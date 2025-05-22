// backend/routes/activityRoutes.js

const express = require("express")
const router = express.Router()
const { pool } = require("../db")
const { authenticateToken } = require("../middlewares/authMiddleware")

router.get("/plants/:id/activities", authenticateToken, async (req, res) => {
  try {
    const plantId = req.params.id

    // Verify plant belongs to user
    const plantCheck = await pool.query("SELECT id FROM plants WHERE id = $1 AND user_id = $2", [plantId, req.user.id])

    if (plantCheck.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบต้นไม้" })
    }

    const result = await pool.query(
      "SELECT id, plant_id, activity_type, notes, performed_at FROM plant_activities WHERE plant_id = $1 ORDER BY performed_at DESC",
      [plantId],
    )

    res.json(
      result.rows.map((activity) => ({
        id: activity.id,
        plantId: activity.plant_id,
        activityType: activity.activity_type,
        notes: activity.notes,
        performedAt: activity.performed_at,
      })),
    )
  } catch (error) {
    console.error("Get activities error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม" })
  }
})

router.post("/plants/:id/activities", authenticateToken, async (req, res) => {
  try {
    const plantId = req.params.id
    const { activityType, notes } = req.body

    // Verify plant belongs to user
    const plantCheck = await pool.query("SELECT id FROM plants WHERE id = $1 AND user_id = $2", [plantId, req.user.id])

    if (plantCheck.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบต้นไม้" })
    }

    const result = await pool.query(
      "INSERT INTO plant_activities (plant_id, activity_type, notes) VALUES ($1, $2, $3) RETURNING id, plant_id, activity_type, notes, performed_at",
      [plantId, activityType, notes || null],
    )

    const activity = result.rows[0]

    res.status(201).json({
      id: activity.id,
      plantId: activity.plant_id,
      activityType: activity.activity_type,
      notes: activity.notes,
      performedAt: activity.performed_at,
    })
  } catch (error) {
    console.error("Create activity error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มกิจกรรม" })
  }
})

module.exports = router