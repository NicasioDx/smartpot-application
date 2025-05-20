import axios from "axios"

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
})

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/"
    }
    return Promise.reject(error)
  },
)

export default api
