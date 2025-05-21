//frontend\src\services\plant-ai-service.js

import api from "./api"
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY)


/**
 * ดึงรายชื่อสายพันธุ์พืชที่นิยมปลูก
 * @param {number} limit - จำนวนสายพันธุ์ที่ต้องการ
 * @returns {Promise<Array>} - รายชื่อสายพันธุ์พืช
 */
export const getPopularPlantSpecies = async (limit = 20) => {
  const response = await api.get(`/api/plants/species?limit=${limit}`)
  return response.data
}

/**
 * ขอคำแนะนำในการดูแลพืช
 * @param {string} species - ชื่อสายพันธุ์พืช
 * @returns {Promise<string>} - คำแนะนำในการดูแลพืช
 */
export const getPlantCareRecommendations = async (species) => {
  const response = await api.get(`/api/plants/care-recommendations?species=${encodeURIComponent(species)}`)
  return response.data.recommendations
}

/**
 * บันทึกสายพันธุ์พืชและคำแนะนำ
 * @param {number} plantId - ID ของต้นไม้
 * @param {string} species - ชื่อสายพันธุ์พืช
 * @param {string} careRecommendations - คำแนะนำในการดูแลพืช
 * @returns {Promise<Object>} - ข้อมูลที่อัปเดต
 */
export const updatePlantSpecies = async (plantId, species, careRecommendations) => {
  const response = await api.post(`/api/plants/${plantId}/species`, {
    species,
    careRecommendations,
  })
  return response.data
}
