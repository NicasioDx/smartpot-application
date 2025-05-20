"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"
import api from "../services/api"
import EditProfileHeader from "../components/profile/EditProfileHeader"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Alert from "../components/ui/Alert"
import Tabs from "../components/ui/Tabs"
import BottomNavigation from "../components/layout/BottomNavigation"

const EditProfilePage = () => {
  const navigate = useNavigate()
  const { currentUser, updateProfile } = useAuth()
  const { addToast } = useToast()

  const [activeTab, setActiveTab] = useState("profile")

  const [profileData, setProfileData] = useState({
    nickname: currentUser?.nickname || "",
    birthDate: currentUser?.birthDate ? new Date(currentUser.birthDate).toISOString().split("T")[0] : "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [profileError, setProfileError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError("")
    setIsProfileLoading(true)

    try {
      await updateProfile({
        nickname: profileData.nickname || null,
        birthDate: profileData.birthDate || null,
      })

      addToast({
        title: "แก้ไขโปรไฟล์สำเร็จ",
        message: "ข้อมูลโปรไฟล์ของคุณถูกอัปเดตแล้ว",
        type: "success",
      })

      navigate("/profile")
    } catch (err) {
      setProfileError(err.response?.data?.error || "เกิดข้อผิดพลาดในการแก้ไขโปรไฟล์")
    } finally {
      setIsProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("รหัสผ่านใหม่ไม่ตรงกัน")
      return
    }

    setIsPasswordLoading(true)

    try {
      await api.put("/api/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      addToast({
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
        message: "รหัสผ่านของคุณถูกอัปเดตแล้ว",
        type: "success",
      })

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      setPasswordError(err.response?.data?.error || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน")
    } finally {
      setIsPasswordLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>กำลังโหลด...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <EditProfileHeader />

      <main className="container mx-auto px-4 py-6">
        <Tabs
          tabs={[
            { id: "profile", label: "ข้อมูลส่วนตัว" },
            { id: "password", label: "รหัสผ่าน" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "profile" && (
          <Card>
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">แก้ไขข้อมูลส่วนตัว</h2>

              {profileError && <Alert type="error" message={profileError} />}

              <div className="space-y-2">
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                  ชื่อเล่น
                </label>
                <Input id="nickname" name="nickname" value={profileData.nickname} onChange={handleProfileChange} />
              </div>

              <div className="space-y-2">
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  วันเกิด
                </label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={profileData.birthDate}
                  onChange={handleProfileChange}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isProfileLoading}>
                {isProfileLoading ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </form>
          </Card>
        )}

        {activeTab === "password" && (
          <Card>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">เปลี่ยนรหัสผ่าน</h2>

              {passwordError && <Alert type="error" message={passwordError} />}

              <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  รหัสผ่านปัจจุบัน
                </label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  รหัสผ่านใหม่
                </label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isPasswordLoading}>
                {isPasswordLoading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
              </Button>
            </form>
          </Card>
        )}
      </main>

      <BottomNavigation />
    </div>
  )
}

export default EditProfilePage
