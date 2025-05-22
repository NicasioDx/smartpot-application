// backend/routes/openai.js
const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/care-recommendation", async (req, res) => {
  const { species } = req.body;

  const prompt = `
คุณคือผู้เชี่ยวชาญด้านการปลูกต้นไม้
โปรดให้คำแนะนำการดูแลสำหรับต้นไม้พันธุ์ "${species}" ที่ครอบคลุมเรื่อง:

1. ความต้องการน้ำ
2. ความต้องการแสง
3. การใส่ปุ๋ย
4. ปัญหาที่พบบ่อย
5. เคล็ดลับพิเศษ

ตอบกลับเป็นภาษาไทยและให้อยู่ในรูปแบบ bullet list
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const careRecommendation = response.choices[0].message.content;
    res.json({ careRecommendation });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลจาก OpenAI ได้" });
  }
});

module.exports = router;
