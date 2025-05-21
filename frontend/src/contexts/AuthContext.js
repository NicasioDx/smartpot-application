"use client"

import { createContext, useState, useContext, useEffect } from "react"
import api from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Fetch user profile
      api
        .get("/api/profile")
        .then((response) => {
          setCurrentUser(response.data)
          setIsAuthenticated(true)
        })
        .catch(() => {
          // Token might be invalid or expired
          localStorage.removeItem("token")
          delete api.defaults.headers.common["Authorization"]
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const response = await api.post("/api/auth/login", { email, password })
    const { token, user } = response.data

    localStorage.setItem("token", token)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`

    setCurrentUser(user)
    setIsAuthenticated(true)

    return user
  }

  const register = async (userData) => {
  const response = await api.post("/api/auth/register", userData)
  return response.data // 👈 แค่ส่งข้อมูลกลับ ไม่ set token, ไม่ set auth
}

  const logout = () => {
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]

    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = async (profileData) => {
    const response = await api.put("/api/profile", profileData)
    setCurrentUser(response.data)
    return response.data
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
