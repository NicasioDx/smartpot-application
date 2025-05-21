// services/api.js
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000", // หรือ URL backend จริง
})

// ดึง token จาก localStorage และแนบทุก request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
