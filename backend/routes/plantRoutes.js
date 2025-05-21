// backend/routes/plantRoutes.js
const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { authenticateToken } = require("../middlewares/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // หรือ config ตามที่ต้องการ

// นำเข้าฟังก์ชันจาก Gemini service
// คุณอาจต้องการเปลี่ยนชื่อถ้ามีการชนกับบริการอื่น เช่น getOpenAICareRecommendations
const {
  getPlantCareRecommendations: getGeminiCareRecommendations,
  getPopularPlantSpecies: getGeminiPopularPlantSpecies,
} = require("../services/gemini-service");

// GET /api/plants
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, user_id, name, species, image_url, care_recommendations, created_at, updated_at FROM plants WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id],
    );

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
    );
  } catch (error) {
    console.error("Get plants error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลต้นไม้" });
  }
});

// GET /api/plants/care-recommendations (ยังคงใช้เหมือนเดิม)
router.get("/care-recommendations", async (req, res) => {
  try {
    const species = req.query.species;
    if (!species) {
      return res.status(400).json({ message: "Missing species" });
    }

    // สร้าง messages array ในรูปแบบที่ Gemini Service คาดหวัง
    const messages = [
      {
        role: "system",
        content:
          "คุณเป็นผู้เชี่ยวชาญด้านการดูแลพืช ให้คำแนะนำที่เป็นประโยชน์และเฉพาะเจาะจงสำหรับการดูแลพืชแต่ละชนิด",
      },
      {
        role: "user",
        content: `ฉันกำลังปลูก ${species} ช่วยแนะนำวิธีการดูแลที่เหมาะสมเกี่ยวกับ:
          1. ความต้องการน้ำ (ความถี่ในการรดน้ำ) เป็นเปอร์เซ็นต์
          2. ความต้องการแสง เป็นเปอร์เซ็นต์
          3. ความต้องการปุ๋ย เป็นเปอร์เซ็นต์
          4. ปัญหาทั่วไปที่อาจพบและวิธีแก้ไข
          5. เคล็ดลับพิเศษในการดูแล

          กรุณาตอบเป็นภาษาไทย และแบ่งหัวข้อให้ชัดเจน`,
      },
    ];

    // เรียกใช้ฟังก์ชันจาก Gemini service ที่รับ messages array
    const recommendation = await getGeminiCareRecommendations(messages);
    res.json({ recommendations: recommendation });
  } catch (err) {
    console.error("Care recommendation error:", err);
    res.status(500).json({ message: "Failed to get care recommendations" });
  }
});

// เพิ่ม API Endpoint ใหม่สำหรับดึงรายชื่อพืชยอดนิยมจาก Gemini
// GET /api/plants/popular-species
router.get("/popular-species", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20; // รับ limit จาก query parameter, default เป็น 20
    const popularPlants = await getGeminiPopularPlantSpecies(limit);
    res.json({ plants: popularPlants });
  } catch (err) {
    console.error("Get popular species error:", err);
    res.status(500).json({ message: "Failed to get popular plant species" });
  }
});

// GET /api/plants/:id
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const plantId = req.params.id;

    const plantResult = await pool.query(
      "SELECT id, user_id, name, species, image_url, care_recommendations, created_at, updated_at FROM plants WHERE id = $1 AND user_id = $2",
      [plantId, req.user.id],
    );

    if (plantResult.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบต้นไม้" });
    }

    const plant = plantResult.rows[0];

    // Get latest sensor data
    const sensorResult = await pool.query(
      "SELECT id, plant_id, moisture_level, npk_nitrogen, npk_phosphorus, npk_potassium, light_level, temperature, recorded_at FROM sensor_data WHERE plant_id = $1 ORDER BY recorded_at DESC LIMIT 1",
      [plantId],
    );

    const sensorData = sensorResult.rows.length > 0 ? sensorResult.rows[0] : null;

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
    });
  } catch (error) {
    console.error("Get plant error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลต้นไม้" });
  }
});

// GET /api/plants/:id/sensor-data
router.get("/:id/sensor-data", authenticateToken, async (req, res) => {
  try {
    const plantId = req.params.id;

    // ตรวจสอบว่าต้นไม้เป็นของ user นี้จริงหรือไม่
    const plantCheck = await pool.query(
      "SELECT id FROM plants WHERE id = $1 AND user_id = $2",
      [plantId, req.user.id],
    );
    if (plantCheck.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบต้นไม้" });
    }

    // ดึงข้อมูล sensor data ล่าสุดของต้นไม้
    const sensorResult = await pool.query(
      `SELECT id, plant_id, moisture_level, npk_nitrogen, npk_phosphorus, npk_potassium, light_level, temperature, recorded_at
         FROM sensor_data
         WHERE plant_id = $1
         ORDER BY recorded_at DESC
         LIMIT 1`,
      [plantId],
    );

    if (sensorResult.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูล sensor สำหรับต้นไม้นี้" });
    }

    res.json(sensorResult.rows[0]);
  } catch (error) {
    console.error("Get sensor data error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูล sensor" });
  }
});

// POST /api/plants
router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { name, species } = req.body;
    let imageUrl = null;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "ชื่อของต้นไม้ (name) ต้องไม่เป็นค่าว่าง" });
    }

    // ถ้ามีไฟล์ image อัปโหลดมา
    if (req.file) {
      // TODO: คุณอาจจะต้องอัปโหลดไฟล์นี้ไปยัง storage ที่เหมาะสม
      // เช่น AWS S3 หรือเซิร์ฟเวอร์ของคุณเอง
      // ตอนนี้สมมติใช้ path แบบ local
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      "INSERT INTO plants (user_id, name, species, image_url) VALUES ($1, $2, $3, $4) RETURNING id, user_id, name, species, image_url, created_at, updated_at",
      [req.user.id, name, species || null, imageUrl],
    );

    const plant = result.rows[0];

    res.status(201).json({
      id: plant.id,
      userId: plant.user_id,
      name: plant.name,
      species: plant.species,
      imageUrl: plant.image_url,
      createdAt: plant.created_at,
      updatedAt: plant.updated_at,
    });
  } catch (error) {
    console.error("Create plant error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มต้นไม้" });
  }
});

// PUT /api/plants/:id
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const plantId = req.params.id;
    const { name, species, imageUrl, careRecommendations } = req.body;

    // Check if plant exists and belongs to user
    const plantCheck = await pool.query("SELECT id FROM plants WHERE id = $1 AND user_id = $2", [
      plantId,
      req.user.id,
    ]);

    if (plantCheck.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบต้นไม้" });
    }

    const result = await pool.query(
      "UPDATE plants SET name = $1, species = $2, image_url = $3, care_recommendations = $4 WHERE id = $5 RETURNING id, user_id, name, species, image_url, care_recommendations, created_at, updated_at",
      [name, species || null, imageUrl || null, careRecommendations || null, plantId],
    );

    const plant = result.rows[0];

    res.json({
      id: plant.id,
      userId: plant.user_id,
      name: plant.name,
      species: plant.species,
      imageUrl: plant.image_url,
      careRecommendations: plant.care_recommendations,
      createdAt: plant.created_at,
      updatedAt: plant.updated_at,
    });
  } catch (error) {
    console.error("Update plant error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตต้นไม้" });
  }
});

// DELETE /api/plants/:id
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const plantId = req.params.id;

    // Check if plant exists and belongs to user
    const plantCheck = await pool.query("SELECT id FROM plants WHERE id = $1 AND user_id = $2", [
      plantId,
      req.user.id,
    ]);

    if (plantCheck.rows.length === 0) {
      return res.status(404).json({ error: "ไม่พบต้นไม้" });
    }

    await pool.query("DELETE FROM plants WHERE id = $1", [plantId]);

    res.json({ success: true });
  } catch (error) {
    console.error("Delete plant error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบต้นไม้" });
  }
});

module.exports = router;