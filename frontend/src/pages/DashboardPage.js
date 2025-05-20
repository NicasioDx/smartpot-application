"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"
import Header from "../components/layout/Header"
import PlantCard from "../components/plants/PlantCard"

const DashboardPage = () => {
  const { addToast } = useToast()
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await api.get("/api/plants")
        setPlants(response.data)
      } catch (error) {
        addToast({
          title: "เกิดข้อผิดพลาด",
          message: "ไม่สามารถโหลดข้อมูลต้นไม้ได้",
          type: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPlants()
  }, [addToast])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="SmartPot" showProfileButton />

      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">ต้นไม้ของฉัน</h1>
          <Link to="/add-plant" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
            เพิ่มต้นไม้
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <p>กำลังโหลด...</p>
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 mb-4">ยังไม่มีต้นไม้</p>
            <Link to="/add-plant" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
              เพิ่มต้นไม้ตอนนี้
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {plants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardPage
