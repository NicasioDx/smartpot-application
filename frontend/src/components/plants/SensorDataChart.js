const SensorDataChart = ({ data }) => {
  // This is a simplified chart component
  // In a real app, you'd use a library like Chart.js or Recharts

  // Get the last 7 data points or fewer if not available
  const chartData = data.slice(0, 7).reverse()

  // Format dates for display
  const labels = chartData.map((item) =>
    new Date(item.recordedAt).toLocaleDateString("th-TH", { month: "short", day: "numeric" }),
  )

  // Get moisture values
  const moistureValues = chartData.map((item) => item.moistureLevel || 0)
  const maxMoisture = Math.max(...moistureValues, 100)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-medium mb-4">ความชื้นในดิน (7 วันล่าสุด)</h3>

      <div className="h-64 flex items-end space-x-2">
        {moistureValues.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-blue-500 rounded-t-sm"
              style={{
                height: `${(value / maxMoisture) * 100}%`,
                minHeight: "4px",
              }}
            ></div>
            <div className="text-xs mt-2 text-gray-500">{labels[index]}</div>
            <div className="text-xs font-medium">{value.toFixed(1)}%</div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-2">ข้อมูลล่าสุด</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500">ความชื้น</div>
            <div className="text-lg font-medium">{data[0]?.moistureLevel?.toFixed(1) || "-"}%</div>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500">อุณหภูมิ</div>
            <div className="text-lg font-medium">{data[0]?.temperature?.toFixed(1) || "-"}°C</div>
          </div>
          <div className="border rounded p-3">
            <div className="text-sm text-gray-500">แสง</div>
            <div className="text-lg font-medium">{data[0]?.lightLevel?.toFixed(1) || "-"}%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SensorDataChart
