// backend/services/gemini-service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config(); // ตรวจสอบให้แน่ใจว่าได้โหลด .env แล้ว

// สร้าง instance ของ GoogleGenerativeAI โดยดึง API Key จาก Environment Variable
// **สำคัญ: คุณต้องมี GEMINI_API_KEY ในไฟล์ .env ของคุณ**
const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

// เพิ่ม log เพื่อตรวจสอบว่า API Key ถูกโหลดแล้ว
console.log("✅ Loaded Gemini API Key:", process.env.GEMINI_API_KEY ? '******' + process.env.GEMINI_API_KEY.slice(-4) : 'No');

/**
 * แปลง array ของ messages (คล้าย OpenAI) ให้เป็น Gemini content format
 * @param {Array<Object>} messages - array ของ messages ที่มี role และ content
 * @returns {Array<Object>} - array ของ Gemini content parts
 */
const convertOpenAIMessagesToGeminiContent = (messages) => {
  const content = [];
  messages.forEach(msg => {
    // Gemini ใช้ 'user' และ 'model' แทน 'user' และ 'assistant'
    // 'system' role ใน OpenAI จะถูกรวมอยู่ใน user prompt สำหรับ Gemini
    if (msg.role === 'system') {
      // สามารถเลือกที่จะรวม system prompt เข้ากับ user prompt แรก
      // หรือสร้างเป็น Part แยกต่างหาก
      content.push({ role: 'user', parts: [{ text: msg.content }] });
    } else if (msg.role === 'user') {
      content.push({ role: 'user', parts: [{ text: msg.content }] });
    } else if (msg.role === 'assistant') {
      content.push({ role: 'model', parts: [{ text: msg.content }] });
    }
  });
  return content;
};

/**
 * ขอคำแนะนำในการดูแลพืชจาก Gemini
 * @param {Array<Object>} messages - array ของ messages ที่มี role และ content เหมือน OpenAI
 * @returns {Promise<string>} - คำแนะนำในการดูแลพืช
 */
async function getPlantCareRecommendations(messages) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // ใช้โมเดลตามที่ต้องการ

    // แปลง messages array ให้เป็น content ที่ Gemini เข้าใจ
    const geminiContent = convertOpenAIMessagesToGeminiContent(messages);

    // ตรวจสอบโครงสร้าง Content ก่อนส่ง (สำหรับการ Debug)
    // console.log("Gemini Content:", JSON.stringify(geminiContent, null, 2));

    const result = await model.generateContent({ contents: geminiContent });

    // ตรวจสอบ result ก่อนดึง response
    // console.log("Gemini Raw Result:", JSON.stringify(result, null, 2));

    // ดึงข้อความตอบกลับ
    const text = result.response.text();

    return text;
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw new Error("ไม่สามารถขอคำแนะนำจาก Gemini ได้ในขณะนี้");
  }
}

/**
 * ขอรายชื่อสายพันธุ์พืชที่นิยมปลูกในบ้านจาก Gemini
 * @param {number} limit - จำนวนสายพันธุ์ที่ต้องการ
 * @returns {Promise<Array>} - รายชื่อสายพันธุ์พืช
 */
async function getPopularPlantSpecies(limit = 20) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // ใช้โมเดลที่เบากว่าสำหรับงานนี้

    const messages = [
      {
        role: "user",
        parts: [{
          text: `แนะนำสายพันธุ์พืชที่นิยมปลูกในบ้านหรือกระถาง ${limit} ชนิด พร้อมคำอธิบายสั้นๆ ตอบในรูปแบบ JSON ดังนี้:
          \`\`\`json
          [
            {
              "name": "ชื่อสายพันธุ์ภาษาไทย",
              "scientificName": "ชื่อวิทยาศาสตร์",
              "description": "คำอธิบายสั้นๆ",
              "difficulty": "ระดับความยากในการดูแล (ง่าย, ปานกลาง, ยาก)"
            }
          ]
          \`\`\`
          ตอบเฉพาะ JSON object เท่านั้น`,
        }],
      },
    ];

    // สำหรับ JSON output, เรามักจะใช้ generateContent({ contents: messages, generationConfig: { responseMimeType: "application/json" } });
    // แต่สำหรับ Gemini 1.5 Flash/Pro มันฉลาดพอที่จะสร้าง JSON จาก prompt ได้เลยถ้าเราบอกให้ดีๆ
    // อย่างไรก็ตาม, การใช้ responseMimeType จะดีกว่าถ้าต้องการการรับประกันว่าจะเป็น JSON
    const result = await model.generateContent({
        contents: messages,
        generationConfig: {
            responseMimeType: "application/json", // ระบุให้ Gemini ส่ง JSON กลับมา
        },
    });

    const rawContent = result.response.text(); // จะได้เป็น string JSON
    // console.log("Gemini Raw JSON Response:", rawContent); // สำหรับ Debug

    // บางครั้ง Gemini อาจจะใส่ ```json และ ``` ครอบมาให้
    // เราต้องจัดการลบออกก่อนที่จะ parse
    const jsonString = rawContent.replace(/```json\n?|\n?```/g, '').trim();

    const parsedResult = JSON.parse(jsonString);

    // OpenAI อาจจะส่ง { "plants": [...] } หรือ [...] มา
    // Gemini มักจะส่งตามรูปแบบที่เราขอ
    return parsedResult;
  } catch (error) {
    console.error("Gemini API error:", error.message);
    throw new Error("ไม่สามารถดึงรายชื่อสายพันธุ์พืชได้ในขณะนี้");
  }
}

module.exports = {
  getPlantCareRecommendations,
  getPopularPlantSpecies,
};