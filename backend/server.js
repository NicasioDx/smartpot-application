//backend\server.js
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const { authenticateToken } = require("./middlewares/authMiddleware") // เพิ่มไฟล์ middleware แยกต่างหากก็ได้
const path = require("path")

const plantRoutes = require("./routes/plantRoutes")
const activityRoutes = require("./routes/activityRoutes")
const iotRoutes = require("./routes/iotRoutes")
const authRoutes = require("./routes/authRoutes")
const profileRoutes = require("./routes/profileRoutes")

dotenv.config()
console.log("🧪 JWT_SECRET:", process.env.JWT_SECRET) // เพิ่มตรงนี้
const app = express()
const PORT = process.env.PORT || 5000
require('dotenv').config()
console.log("OpenAI API Key Loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No")

app.use(cors({
  origin: "http://localhost:3001", // แหล่งที่ frontend รันอยู่
  allowedHeaders: ["Content-Type", "Authorization"] // 🟢 สำคัญ!
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/profile", profileRoutes)
app.use("/api/plants", plantRoutes)
app.use("/api/", activityRoutes)
app.use("/api/iot", iotRoutes)
app.use("/api/auth", authRoutes)

const uploadsPath = path.join(__dirname, 'uploads');
console.log("Uploads folder path:", uploadsPath);
app.use('/uploads', express.static(uploadsPath));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
