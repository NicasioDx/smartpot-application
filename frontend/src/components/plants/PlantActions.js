"use client"

import { useState } from "react"

const PlantActions = ({ onWater, onFertilize }) => {
  const [isWatering, setIsWatering] = useState(false)
  const [isFertilizing, setIsFertilizing] = useState(false)

  const handleWater = async () => {
    setIsWatering(true)
    try {
      await onWater()
    } finally {
      setIsWatering(false)
    }
  }

  const handleFertilize = async () => {
    setIsFertilizing(true)
    try {
      await onFertilize()
    } finally {
      setIsFertilizing(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <button
        onClick={handleWater}
        disabled={isWatering}
        className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        {isWatering ? "กำลังรดน้ำ..." : "รดน้ำ"}
      </button>

      <button
        onClick={handleFertilize}
        disabled={isFertilizing}
        className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        {isFertilizing ? "กำลังใส่ปุ๋ย..." : "ใส่ปุ๋ย"}
      </button>
    </div>
  )
}

export default PlantActions
