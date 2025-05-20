const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const { Pool } = require("pg")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // บอก explicitly ว่าไม่ใช้ SSL
});

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err)
  } else {
    console.log("Database connected successfully")
  }
})

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) return res.status(401).json({ error: "ไม่ได้เข้าสู่ระบบ" })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "โทเค็นไม่ถูกต้องหรือหมดอายุ" })
    req.user = user
    next()
  })
}

// Routes

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, nickname, birthDate } = req.body

    // Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: "อีเมลนี้ถูกใช้งานแล้ว" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const result = await pool.query(
      "INSERT INTO users (email, password, nickname, birth_date) VALUES ($1, $2, $3, $4) RETURNING id, email, nickname, birth_date",
      [email, hashedPassword, nickname || null, birthDate ? new Date(birthDate) : null],
    )

    const user = result.rows[0]

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        birthDate: user.birth_date,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลงทะเบียน" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" })
    }

    const user = result.rows[0]

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        birthDate: user.birth_date,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" })
  }
})

// User profile routes
app.get("/api/profile", authenticateToken, async (req, res) => {
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

app.put("/api/profile", authenticateToken, async (req, res) => {
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

// Plant routes
app.get("/api/plants", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, user_id, name, species, image_url, care_recommendations, created_at, updated_at FROM plants WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id],
    )

    res.json(
      result.rows.map((plant) => ({
        id: plant.id,
        userId: plant.user_id,
        name: plant.name,
        species: plant.species,
        imageUrl: plant.image_url,
        careRecommendations: plant.care_recommendations,
        createdAt: plant.created_at,
        updatedAt: plant.updated_at,
      })),
    )
  } catch (error) {
    console.error("Get plants error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลต้นไม้" })
  }
})

app.get("/api/plants/:id", authenticateToken, async (req, res) => {
  try {
    const plantId = req.params.id

    const plantResult = await pool.query(
      "SELECT id, user_id, name, species, image_url, care_recommendations, created_at, updated_at FROM plants WHERE id = $1 AND user_id = $2",
      [plantId, req.user.id],
    )

    if (plantResult.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบต้นไม้" })
    }

    const plant = plantResult.rows[0]

    // Get latest sensor data
    const sensorResult = await pool.query(
      "SELECT id, plant_id, moisture_level, npk_nitrogen, npk_phosphorus, npk_potassium, light_level, temperature, recorded_at FROM sensor_data WHERE plant_id = $1 ORDER BY recorded_at DESC LIMIT 1",
      [plantId],
    )

    const sensorData = sensorResult.rows.length > 0 ? sensorResult.rows[0] : null

    res.json({
      id: plant.id,
      userId: plant.user_id,
      name: plant.name,
      species: plant.species,
      imageUrl: plant.image_url,
      careRecommendations: plant.care_recommendations,
      createdAt: plant.created_at,
      updatedAt: plant.updated_at,
      sensorData: sensorData
        ? {
            id: sensorData.id,
            plantId: sensorData.plant_id,
            moistureLevel: sensorData.moisture_level,
            npkNitrogen: sensorData.npk_nitrogen,
            npkPhosphorus: sensorData.npk_phosphorus,
            npkPotassium: sensorData.npk_potassium,
            lightLevel: sensorData.light_level,
            temperature: sensorData.temperature,
            recordedAt: sensorData.recorded_at,
          }
        : null,
    })
  } catch (error) {
    console.error("Get plant error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลต้นไม้" })
  }
})

app.post("/api/plants", authenticateToken, async (req, res) => {
  try {
    const { name, species, imageUrl, careRecommendations } = req.body

    const result = await pool.query(
      "INSERT INTO plants (user_id, name, species, image_url, care_recommendations) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id, name, species, image_url, care_recommendations, created_at, updated_at",
      [req.user.id, name, species || null, imageUrl || null, careRecommendations || null],
    )

    const plant = result.rows[0]

    res.status(201).json({
      id: plant.id,
      userId: plant.user_id,
      name: plant.name,
      species: plant.species,
      imageUrl: plant.image_url,
      careRecommendations: plant.care_recommendations,
      createdAt: plant.created_at,
      updatedAt: plant.updated_at,
    })
  } catch (error) {
    console.error("Create plant error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มต้นไม้" })
  }
})

app.put("/api/plants/:id", authenticateToken, async (req, res) => {
  try {
    const plantId = req.params.id
    const { name, species, imageUrl, careRecommendations } = req.body

    // Check if plant exists and belongs to user
    const plantCheck = await pool.query("SELECT id FROM plants WHERE id = $1 AND user_id = $2", [plantId, req.user.id])

    if (plantCheck.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบต้นไม้" })
    }

    const result = await pool.query(
      "UPDATE plants SET name = $1, species = $2, image_url = $3, care_recommendations = $4 WHERE id = $5 RETURNING id, user_id, name, species, image_url, care_recommendations, created_at, updated_at",
      [name, species || null, imageUrl || null, careRecommendations || null, plantId],
    )

    const plant = result.rows[0]

    res.json({
      id: plant.id,
      userId: plant.user_id,
      name: plant.name,
      species: plant.species,
      imageUrl: plant.image_url,
      careRecommendations: plant.care_recommendations,
      createdAt: plant.created_at,
      updatedAt: plant.updated_at,
    })
  } catch (error) {
    console.error("Update plant error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตต้นไม้" })
  }
})

app.delete("/api/plants/:id", authenticateToken, async (req, res) => {
  try {
    const plantId = req.params.id

    // Check if plant exists and belongs to user
    const plantCheck = await pool.query("SELECT id FROM plants WHERE id = $1 AND user_id = $2", [plantId, req.user.id])

    if (plantCheck.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบต้นไม้" })
    }

    await pool.query("DELETE FROM plants WHERE id = $1", [plantId])

    res.json({ success: true })
  } catch (error) {
    console.error("Delete plant error:", error)
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบต้นไม้" })
  }
})

// Plant activities routes
app.get("/api/plants/:id/activities", authenticateToken, async (req, res) => {
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

app.post("/api/plants/:id/activities", authenticateToken, async (req, res) => {
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

// Sensor data routes
app.get("/api/plants/:id/sensor-data", authenticateToken, async (req, res) => {
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
app.post("/api/iot/sensor-data", async (req, res) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
