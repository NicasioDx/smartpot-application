const OpenAI = require("openai")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * ขอคำแนะนำในการดูแลพืชจาก OpenAI
 * @param {string} plantSpecies - ชื่อสายพันธุ์พืช
 * @returns {Promise<string>} - คำแนะนำในการดูแลพืช
 */
async function getPlantCareRecommendations(plantSpecies) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "คุณเป็นผู้เชี่ยวชาญด้านการดูแลพืช ให้คำแนะนำที่เป็นประโยชน์และเฉพาะเจาะจงสำหรับการดูแลพืชแต่ละชนิด",
        },
        {
          role: "user",
          content: `ฉันกำลังปลูก ${plantSpecies} ช่วยแนะนำวิธีการดูแลที่เหมาะสมเกี่ยวกับ:
          1. ความต้องการน้ำ (ความถี่ในการรดน้ำ)
          2. ความต้องการแสง
          3. อุณหภูมิที่เหมาะสม
          4. ความต้องการปุ๋ย
          5. ปัญหาทั่วไปที่อาจพบและวิธีแก้ไข
          6. เคล็ดลับพิเศษในการดูแล
          
          กรุณาตอบเป็นภาษาไทย และแบ่งหัวข้อให้ชัดเจน`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error("OpenAI API error:", error)
    throw new Error("ไม่สามารถขอคำแนะนำได้ในขณะนี้")
  }
}

/**
 * ขอรายชื่อสายพันธุ์พืชที่นิยมปลูกในบ้าน
 * @param {number} limit - จำนวนสายพันธุ์ที่ต้องการ
 * @returns {Promise<Array>} - รายชื่อสายพันธุ์พืช
 */
async function getPopularPlantSpecies(limit = 20) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "คุณเป็นผู้เชี่ยวชาญด้านพืช ให้ข้อมูลเกี่ยวกับสายพันธุ์พืชที่นิยมปลูกในบ้านหรือกระถาง",
        },
        {
          role: "user",
          content: `แนะนำสายพันธุ์พืชที่นิยมปลูกในบ้านหรือกระถาง ${limit} ชนิด พร้อมคำอธิบายสั้นๆ ตอบในรูปแบบ JSON ดังนี้:
          [
            {
              "name": "ชื่อสายพันธุ์ภาษาไทย",
              "scientificName": "ชื่อวิทยาศาสตร์",
              "description": "คำอธิบายสั้นๆ",
              "difficulty": "ระดับความยากในการดูแล (ง่าย, ปานกลาง, ยาก)"
            }
          ]`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const result = JSON.parse(response.choices[0].message.content)
    return result.length ? result : result.plants || []
  } catch (error) {
    console.error("OpenAI API error:", error)
    throw new Error("ไม่สามารถดึงรายชื่อสายพันธุ์พืชได้ในขณะนี้")
  }
}

module.exports = {
  getPlantCareRecommendations,
  getPopularPlantSpecies,
}
