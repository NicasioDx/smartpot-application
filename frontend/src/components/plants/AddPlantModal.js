"use client"

import { useState, useEffect } from "react"
import api from "../../services/api"
import { getPopularPlantSpecies } from "../../services/plant-ai-service"
import { useToast } from "../../contexts/ToastContext"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Alert from "../ui/Alert"
import { XIcon } from "../icons"

const AddPlantModal = ({ isOpen, onClose, onAddPlant }) => {
  const { addToast } = useToast()
  const [name, setName] = useState("")
  const [species, setSpecies] = useState([])
  const [selectedSpecies, setSelectedSpecies] = useState("")
  const [customSpecies, setCustomSpecies] = useState("")
  const [imageFile, setImageFile] = useState(null) // [เพิ่ม] เก็บไฟล์ภาพ
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeciesLoading, setIsSpeciesLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const fetchSpecies = async () => {
        try {
          setIsSpeciesLoading(true)
          const data = await getPopularPlantSpecies()
          setSpecies(data)
        } catch (err) {
          console.error("Error fetching plant species:", err)
        } finally {
          setIsSpeciesLoading(false)
        }
      }

      fetchSpecies()
    }
  }, [isOpen])

  const handleSpeciesSelect = (e) => {
    setSelectedSpecies(e.target.value)
    setCustomSpecies("")
  }

  const handleCustomSpeciesChange = (e) => {
    setCustomSpecies(e.target.value)
    setSelectedSpecies("")
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file) // [เพิ่ม] เก็บไฟล์ที่เลือก
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const finalSpecies = selectedSpecies || customSpecies || null

    try {
      // [แก้ไข] ส่งข้อมูลแบบ FormData เพื่อรองรับไฟล์
      const formData = new FormData()
      formData.append("name", name)
      formData.append("species", finalSpecies)
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await api.post("/api/plants", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      onAddPlant(response.data)

      // reset form
      setName("")
      setSelectedSpecies("")
      setCustomSpecies("")
      setImageFile(null) // [เพิ่ม] รีเซ็ตไฟล์ภาพหลังเพิ่มเสร็จ
    } catch (err) {
      setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการเพิ่มต้นไม้")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

        <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">เพิ่มต้นไม้</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4" encType="multipart/form-data">
            {error && <Alert type="error" message={error} />}

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                ชื่อต้นไม้
              </label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">สายพันธุ์พืช (ถ้าทราบ)</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={selectedSpecies}
                onChange={handleSpeciesSelect}
                disabled={isSpeciesLoading}
              >
                <option value="">-- เลือกสายพันธุ์ --</option>
                {species.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name} ({item.scientificName})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">หรือ</p>
              <Input placeholder="ระบุสายพันธุ์เอง" value={customSpecies} onChange={handleCustomSpeciesChange} />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                รูปภาพ
              </label>
              {/* [แก้ไข] เอา disabled ออก และเพิ่ม onChange */}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-xs text-gray-500">* สามารถเลือกไฟล์รูปภาพได้</p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={onClose}>
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "กำลังเพิ่มต้นไม้..." : "เพิ่มต้นไม้"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddPlantModal
