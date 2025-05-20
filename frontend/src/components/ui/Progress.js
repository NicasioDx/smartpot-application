const Progress = ({ value = 0, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}></div>
    </div>
  )
}

export default Progress
