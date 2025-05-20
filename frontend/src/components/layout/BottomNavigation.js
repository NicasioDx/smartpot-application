"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { HomeIcon, LogOutIcon } from "../icons"

const BottomNavigation = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button className="flex flex-col items-center justify-center h-12 w-12" onClick={() => navigate("/dashboard")}>
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs mt-1">หน้าหลัก</span>
        </button>

        <button className="flex flex-col items-center justify-center h-12 w-12" onClick={handleLogout}>
          <LogOutIcon className="h-6 w-6" />
          <span className="text-xs mt-1">ออกจากระบบ</span>
        </button>
      </div>
    </div>
  )
}

export default BottomNavigation
