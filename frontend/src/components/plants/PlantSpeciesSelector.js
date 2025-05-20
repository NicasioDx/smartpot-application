"use client"

import { useState, useEffect } from "react"
import {
  getPopularPlantSpecies,
  getPlantCareRecommendations,
  updatePlantSpecies,
} from "../../services/plant-ai-service"
import Button from "../ui/Button"
import Card from "../ui/Card"
import Alert from "../ui/Alert"

const PlantSpeciesSelector = ({ plantId, currentSpecies, onSpeciesUpdate }) => {
  const [loading, setLoading] = useState(false)
  const [recommendationsLoading, setRecommendationsLoading] = useState(false)
  const [species, setSpecies] = useState([])
  const [selectedSpecies, setSelectedSpecies] = useState(currentSpecies || "")
  const [customSpecies, setCustomSpecies] = useState("")
  const [recommendations, setRecommendations] = useState("")
  const [error, setError] = useState("")
  const [showRecommendations, setShowRecommendations] = useState(false)

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        setLoading(true)
        const data = await getPopularPlantSpecies()
        setSpecies(data)
      } catch (err) {
        setError("ไม่สามารถโหลดรายชื่อสายพันธุ์พืชได้")
      } finally {
        setLoading(false)
      }
    }

    fetchSpecies()
  }, [])

  const handleSpeciesSelect = (e) => {
    setSelectedSpecies(e.target.value)
    setCustomSpecies("")
  }

  const handleCustomSpeciesChange = (e) => {
    setCustomSpecies(e.target.value)
    setSelectedSpecies("")
  }

  const handleGetRecommendations = async () => {
    const speciesName = selectedSpecies || customSpecies
    if (!speciesName) {
      setError("กรุณาเลือกหรือระบุสายพันธุ์พืช")
      return
    }

    try {
      setRecommendationsLoading(true)
      setError("")
      const data = await getPlantCareRecommendations(speciesName)
      setRecommendations(data)
      setShowRecommendations(true)
    } catch (err) {
      setError("ไม่สามารถขอคำแนะนำได้ในขณะนี้")
    } finally {
      setRecommendationsLoading(false)
    }
  }

  const handleSaveSpecies = async () => {
    const speciesName = selectedSpecies || customSpecies
    if (!speciesName) {
      setError("กรุณาเลือกหรือระบุสายพันธุ์พืช")
      return
    }

    try {
      setLoading(true)
      await updatePlantSpecies(plantId, speciesName, recommendations)
      if (onSpeciesUpdate) {
        onSpeciesUpdate(speciesName, recommendations)
      }
      setError("")
    } catch (err) {
      setError("ไม่สามารถบันทึกสายพันธุ์พืชได้")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">เลือกสายพันธุ์พืช</h3>

        {error && <Alert type="error" message={error} />}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลือกจากรายการ</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={selectedSpecies}
              onChange={handleSpeciesSelect}
              disabled={loading}
            >
              <option value="">-- เลือกสายพันธุ์ --</option>
              {species.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.name} ({item.scientificName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm">หรือ</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ระบุสายพันธุ์เอง</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={customSpecies}
              onChange={handleCustomSpeciesChange}
              placeholder="เช่น มอนสเตอร่า, กล้วยไม้, กุหลาบ"
              disabled={loading}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleGetRecommendations}
              disabled={loading || recommendationsLoading || (!selectedSpecies && !customSpecies)}
              className="flex-1"
            >
              {recommendationsLoading ? "กำลังขอคำแนะนำ..." : "ขอคำแนะนำในการดูแล"}
            </Button>

            <Button
              onClick={handleSaveSpecies}
              disabled={loading || (!selectedSpecies && !customSpecies)}
              variant="outline"
              className="flex-1"
            >
              {loading ? "กำลังบันทึก..." : "บันทึกสายพันธุ์"}
            </Button>
          </div>
        </div>

        {showRecommendations && recommendations && (
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">คำแนะนำในการดูแล</h4>
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line text-sm">{recommendations}</div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default PlantSpeciesSelector
