// backend/routes/iotRoutes.js
const express = require("express")
const router = express.Router()
const { pool } = require("../db")
const { authenticateToken } = require("../middlewares/authMiddleware")

// Sensor data routes
router.get("/api/plants/:id/sensor-data", authenticateToken, async (req, res) => {
  try {
    const plantId = req.params.id

    // Verify plant belongs to user
    const plantCheck = await pool.query("SELECT id FROM plants WHERE id = $1 AND user_id = $2", [plantId, req.user.id])

    if (plantCheck.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบต้นไม้" })
    }

    const result = await pool.query(
      "SELECT id, plant_id, moisture_level, npk_nitrogen, npk_phosphorus, npk_potassium, light_level, temperature, recorded_at FROM sensor_data WHERE plant_id = $1 ORDER BY recorded_at DESC LIMIT 10",
      [plantId],
    )

    res.json(
      result.rows.map((data) => ({
        id: data.id,
        plantId: data.plant_id,
        moistureLevel: data.moisture_level,
        npkNitrogen: data.npk_nitrogen,
        npkPhosphorus: data.npk_phosphorus,
        npkPotassium: data.npk_potassium,
        lightLevel: data.light_level,
        temperature: data.temperature,
        recordedAt: data.recorded_at,
      })),
    )
  } catch (error) {
    console.error("Get sensor data error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเซ็นเซอร์" })
  }
})

// IoT endpoint for sensor data
router.post("/api/iot/sensor-data", async (req, res) => {
  try {
    const { plantId, moistureLevel, npkNitrogen, npkPhosphorus, npkPotassium, lightLevel, temperature } = req.body

    // In a real app, you'd validate the request with an API key or other auth method

    const result = await pool.query(
      "INSERT INTO sensor_data (plant_id, moisture_level, npk_nitrogen, npk_phosphorus, npk_potassium, light_level, temperature) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [
        plantId,
        moistureLevel || null,
        npkNitrogen || null,
        npkPhosphorus || null,
        npkPotassium || null,
        lightLevel || null,
        temperature || null,
      ],
    )

    res.status(201).json({ success: true, id: result.rows[0].id })
  } catch (error) {
    console.error("Save sensor data error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูลเซ็นเซอร์" })
  }
})

module.exports = router