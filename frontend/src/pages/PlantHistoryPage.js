"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"
import Header from "../components/layout/Header"
import ActivityList from "../components/plants/ActivityList"

const PlantHistoryPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [plant, setPlant] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch plant details
        const plantResponse = await api.get(`/api/plants/${id}`)
        setPlant(plantResponse.data)

        // Fetch plant activities
        const activitiesResponse = await api.get(`/api/plants/${id}/activities`)
        setActivities(activitiesResponse.data)
      } catch (error) {
        addToast({
          title: "เกิดข้อผิดพลาด",
          message: "ไม่สามารถโหลดข้อมูลประวัติได้",
          type: "error",
        })
        navigate("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, navigate, addToast])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`ประวัติ: ${plant.name}`} showBackButton backTo={`/plants/${id}`} />

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">ประวัติการดูแล</h1>

        <ActivityList activities={activities} />
      </main>
    </div>
  )
}

export default PlantHistoryPage
