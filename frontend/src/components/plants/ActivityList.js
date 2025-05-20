const ActivityList = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">ยังไม่มีประวัติการดูแล</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          {activity.activityType === "watering" ? (
            <div className="bg-blue-100 text-blue-500 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          ) : (
            <div className="bg-green-100 text-green-500 p-3 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          )}

          <div className="flex-1">
            <h3 className="font-medium">{activity.activityType === "watering" ? "รดน้ำ" : "ใส่ปุ๋ย"}</h3>
            {activity.notes && <p className="text-sm text-gray-500">{activity.notes}</p>}
            <p className="text-sm text-gray-500">
              {new Date(activity.performedAt).toLocaleString("th-TH", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ActivityList
