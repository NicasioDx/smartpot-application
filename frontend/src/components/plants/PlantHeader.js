import { Link } from "react-router-dom"
import { ChevronLeftIcon, HistoryIcon } from "../icons"

const PlantHeader = ({ plant }) => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link to="/dashboard">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="ml-2 text-lg font-semibold truncate">{plant.name}</h1>
        </div>

        <Link to={`/plants/${plant.id}/history`}>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <HistoryIcon className="h-5 w-5" />
          </button>
        </Link>
      </div>
    </header>
  )
}

export default PlantHeader
