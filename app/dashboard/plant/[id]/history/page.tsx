import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getPlantById } from "@/lib/db/plants"
import { getPlantActivities } from "@/lib/db/activities"
import PlantHistoryHeader from "@/components/plants/plant-history-header"
import ActivityList from "@/components/plants/activity-list"
import BottomNavigation from "@/components/layout/bottom-navigation"

export default async function PlantHistoryPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const plantId = Number.parseInt(params.id)
  const plant = await getPlantById(plantId, session.user.id)

  if (!plant) {
    redirect("/dashboard")
  }

  const activities = await getPlantActivities(plantId)

  return (
    <main className="min-h-screen pb-16">
      <PlantHistoryHeader plant={plant} />
      <div className="container px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">ประวัติการดูแล</h1>
        <ActivityList activities={activities} />
      </div>
      <BottomNavigation />
    </main>
  )
}
