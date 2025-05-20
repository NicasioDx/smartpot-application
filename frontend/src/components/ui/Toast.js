"use client"

import { useEffect } from "react"
import { XIcon } from "../icons"

const Toast = ({ title, message, type = "success", onClose }) => {
  const typeClasses = {
    success: "bg-green-50 border-green-500 text-green-800",
    error: "bg-red-50 border-red-500 text-red-800",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`w-72 border-l-4 rounded-md shadow-md ${typeClasses[type]}`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="font-medium">{title}</div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
        {message && <div className="mt-1 text-sm">{message}</div>}
      </div>
    </div>
  )
}

export default Toast
