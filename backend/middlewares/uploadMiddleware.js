// backend/middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// ตั้งค่า storage ของ multer ให้บันทึกไฟล์ใน backend/uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // __dirname อาจจะอยู่ใน folder routes ให้ adjust path นิดหน่อย
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    // ตั้งชื่อไฟล์ใหม่ เช่น ใช้เวลาปัจจุบัน + ชื่อไฟล์เดิม
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });


module.exports = upload; // ✅ CommonJS export
