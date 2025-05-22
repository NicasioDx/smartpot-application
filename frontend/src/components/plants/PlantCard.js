//frontend/src/components/plants/PlantCard.js
import { Link } from "react-router-dom"

const PlantCard = ({ plant }) => {
  return (
    <Link to={`/plants/${plant.id}`}>
      <div className="bg-white rounded-lg shadow overflow-hidden transition-transform hover:scale-105">
        <div className="aspect-square relative">
          <img
  src={`http://localhost:5000${plant.imageUrl}`}
  alt={plant.name}
  className="w-full h-full object-cover"
/>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg truncate">{plant.name}</h3>
          {plant.species && <p className="text-gray-500 truncate">{plant.species}</p>}
        </div>
      </div>
    </Link>
  )
}

export default PlantCard
