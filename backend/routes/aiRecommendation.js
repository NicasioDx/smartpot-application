const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/recommend-values", async (req, res) => {
  const { species } = req.body;

  const prompt = `
คุณคือผู้เชี่ยวชาญด้านพืชสวน
โปรดให้ค่าตัวเลขที่แนะนำสำหรับการเจริญเติบโตที่เหมาะสมของพืชพันธุ์ \"${species}\" ในรูปแบบ JSON โดยมีค่าดังนี้:
- moistureLevel (ความชื้นในดิน) เป็น %
- lightLevel (ความเข้มแสง) เป็น %
- npkNitrogen (ไนโตรเจน) เป็น %
- npkPhosphorus (ฟอสฟอรัส) เป็น %
- npkPotassium (โพแทสเซียม) เป็น %

ตอบกลับเป็น JSON เท่านั้น เช่น:
{
  "moistureLevel": 60,
  "lightLevel": 70,
  "npkNitrogen": 40,
  "npkPhosphorus": 30,
  "npkPotassium": 20
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 300,
    });

    let content = response.choices[0].message.content;

    // ลบเครื่องหมาย ```json ... ``` ครอบ JSON ออกก่อน parse
    content = content.trim();
    if (content.startsWith("```json")) {
      content = content.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (content.startsWith("```")) {
      content = content.replace(/^```/, "").replace(/```$/, "").trim();
    }

    try {
      const parsed = JSON.parse(content);
      res.json(parsed);
    } catch (jsonErr) {
      console.error("Failed to parse JSON from OpenAI response:", content);
      res.status(500).json({ error: "ไม่สามารถแปลงค่าที่ได้จาก AI เป็น JSON ได้" });
    }
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดจากฝั่ง OpenAI" });
  }
});

module.exports = router;
