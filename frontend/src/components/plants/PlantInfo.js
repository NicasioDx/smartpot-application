const PlantInfo = ({ plant }) => {
  // Default values if no sensor data is available
  const sensorData = plant.sensorData || {}
  const moistureLevel = sensorData.moistureLevel ?? 50
  const lightLevel = sensorData.lightLevel ?? 60
  const nitrogenLevel = sensorData.npkNitrogen ?? 40
  const phosphorusLevel = sensorData.npkPhosphorus ?? 30
  const potassiumLevel = sensorData.npkPotassium ?? 20
  const temperature = sensorData.temperature ?? 25

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
            src={`http://localhost:5000${plant.imageUrl}`}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
          </div>
        </div>

        <div className="md:w-2/3">
          <h1 className="text-2xl font-bold mb-2">{plant.name}</h1>
          {plant.species && <p className="text-gray-500 mb-4">{plant.species}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">ความชื้น</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${moistureLevel}%` }}></div>
              </div>
              <p className="text-right text-sm text-gray-500 mt-1">{moistureLevel.toFixed(1)}%</p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">แสง</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${lightLevel}%` }}></div>
              </div>
              <p className="text-right text-sm text-gray-500 mt-1">{lightLevel.toFixed(1)}%</p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">อุณหภูมิ</h3>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold">{temperature.toFixed(1)}°C</span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">แร่ธาตุในดิน</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>ไนโตรเจน (N)</span>
                    <span>{nitrogenLevel.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${nitrogenLevel}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>ฟอสฟอรัส (P)</span>
                    <span>{phosphorusLevel.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${phosphorusLevel}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>โพแทสเซียม (K)</span>
                    <span>{potassiumLevel.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${potassiumLevel}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {plant.careRecommendations && (
            <div className="mt-4 border rounded-lg p-4">
              <h3 className="font-medium mb-2">คำแนะนำในการดูแล</h3>
              <p className="text-sm whitespace-pre-line">{plant.careRecommendations}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlantInfo
