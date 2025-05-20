"use client"

import { createContext, useState, useContext } from "react"

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = ({ title, message, type = "success", duration = 5000 }) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, title, message, type }])

    setTimeout(() => {
      removeToast(id)
    }, duration)

    return id
  }

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  const value = {
    toasts,
    addToast,
    removeToast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-md ${
              toast.type === "success"
                ? "bg-green-50 border-l-4 border-green-500 text-green-700"
                : toast.type === "error"
                  ? "bg-red-50 border-l-4 border-red-500 text-red-700"
                  : toast.type === "warning"
                    ? "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700"
                    : "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
            }`}
          >
            <div className="flex justify-between">
              <h3 className="font-medium">{toast.title}</h3>
              <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
                &times;
              </button>
            </div>
            {toast.message && <p className="text-sm mt-1">{toast.message}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
