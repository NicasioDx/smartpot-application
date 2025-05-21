// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken")

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  console.log("🔍 Authorization Header:", authHeader) // ✅ log ตรงนี้
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) return res.status(401).json({ error: "ไม่ได้เข้าสู่ระบบ" })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "โทเค็นไม่ถูกต้องหรือหมดอายุ" })
    req.user = user // user จะมี {id, email} ตาม payload
    next()
  })
}

module.exports = { authenticateToken }
