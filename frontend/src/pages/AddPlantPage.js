"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { useToast } from "../contexts/ToastContext"
import Header from "../components/layout/Header"

const AddPlantPage = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [name, setName] = useState("")
  const [species, setSpecies] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("species", species || "")
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await api.post("/api/plants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      addToast({
        title: "เพิ่มต้นไม้สำเร็จ",
        message: `เพิ่ม ${name} เรียบร้อยแล้ว`,
        type: "success",
      })

      navigate(`/plants/${response.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการเพิ่มต้นไม้")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="เพิ่มต้นไม้" showBackButton backTo="/dashboard" />

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                ชื่อต้นไม้
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="species" className="block text-sm font-medium text-gray-700">
                สายพันธุ์ (ถ้าทราบ)
              </label>
              <input
                id="species"
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                รูปภาพ
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
              {imageFile && (
                <p className="mt-1 text-sm text-gray-500">ไฟล์ที่เลือก: {imageFile.name}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? "กำลังเพิ่มต้นไม้..." : "เพิ่มต้นไม้"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default AddPlantPage
