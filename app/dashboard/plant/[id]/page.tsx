import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getPlantById } from "@/lib/db/plants"
import { getLatestSensorData } from "@/lib/db/sensor-data"
import PlantHeader from "@/components/plants/plant-header"
import PlantDetails from "@/components/plants/plant-details"
import PlantActions from "@/components/plants/plant-actions"
import BottomNavigation from "@/components/layout/bottom-navigation"

export default async function PlantPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const plantId = Number.parseInt(params.id)
  const plant = await getPlantById(plantId, session.user.id)

  if (!plant) {
    redirect("/dashboard")
  }

  const sensorData = await getLatestSensorData(plantId)

  return (
    <main className="min-h-screen pb-16">
      <PlantHeader plant={plant} />
      <div className="container px-4 py-6">
        <PlantDetails plant={plant} sensorData={sensorData} />
        <PlantActions plantId={plantId} />
      </div>
      <BottomNavigation />
    </main>
  )
}
