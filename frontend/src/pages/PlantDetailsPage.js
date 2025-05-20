"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"
import Header from "../components/layout/Header"
import PlantInfo from "../components/plants/PlantInfo"
import PlantActions from "../components/plants/PlantActions"
import SensorDataChart from "../components/plants/SensorDataChart"

const PlantDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [plant, setPlant] = useState(null)
  const [sensorData, setSensorData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plant details
        const plantResponse = await api.get(`/api/plants/${id}`)
        setPlant(plantResponse.data)

        // Fetch sensor data history
        const sensorResponse = await api.get(`/api/plants/${id}/sensor-data`)
        setSensorData(sensorResponse.data)
      } catch (error) {
        addToast({
          title: "เกิดข้อผิดพลาด",
          message: "ไม่สามารถโหลดข้อมูลต้นไม้ได้",
          type: "error",
        })
        navigate("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, navigate, addToast])

  const handleWater = async () => {
    try {
      await api.post(`/api/plants/${id}/activities`, {
        activityType: "watering",
        notes: "รดน้ำต้นไม้",
      })

      addToast({
        title: "รดน้ำเสร็จแล้ว",
        message: "ต้นไม้ของคุณได้รับน้ำแล้ว",
        type: "success",
      })
    } catch (error) {
      addToast({
        title: "เกิดข้อผิดพลาด",
        message: "ไม่สามารถรดน้ำต้นไม้ได้",
        type: "error",
      })
    }
  }

  const handleFertilize = async () => {
    try {
      await api.post(`/api/plants/${id}/activities`, {
        activityType: "fertilizing",
        notes: "ใส่ปุ๋ยต้นไม้",
      })

      addToast({
        title: "ใส่ปุ๋ยเสร็จสิ้น",
        message: "ใส่ปุ๋ยเสร็จสิ้น แล้วกลับมาใส่ใหม่ในครั้งถัดไป",
        type: "success",
      })
    } catch (error) {
      addToast({
        title: "เกิดข้อผิดพลาด",
        message: "ไม่สามารถใส่ปุ๋ยต้นไม้ได้",
        type: "error",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={plant.name}
        showBackButton
        backTo="/dashboard"
        showHistoryButton
        historyTo={`/plants/${id}/history`}
      />

      <main className="container mx-auto px-4 py-6">
        <PlantInfo plant={plant} />

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">ข้อมูลเซ็นเซอร์</h2>
          {sensorData.length > 0 ? (
            <SensorDataChart data={sensorData} />
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">ยังไม่มีข้อมูลเซ็นเซอร์</p>
            </div>
          )}
        </div>

        <PlantActions onWater={handleWater} onFertilize={handleFertilize} />
      </main>
    </div>
  )
}

export default PlantDetailsPage
