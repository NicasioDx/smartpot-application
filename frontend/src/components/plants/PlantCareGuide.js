import Card from "../ui/Card"
import { LeafIcon } from "../icons"

const PlantCareGuide = ({ species, recommendations }) => {
  if (!species || !recommendations) {
    return null
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <LeafIcon className="h-5 w-5 text-green-500" />
          <h3 className="font-medium">คำแนะนำในการดูแล {species}</h3>
        </div>

        <div className="text-sm whitespace-pre-line">{recommendations}</div>
      </div>
    </Card>
  )
}

export default PlantCareGuide
