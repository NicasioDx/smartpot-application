import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getUserPlants } from "@/lib/db/plants"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import PlantGrid from "@/components/dashboard/plant-grid"
import AddPlantButton from "@/components/dashboard/add-plant-button"
import BottomNavigation from "@/components/layout/bottom-navigation"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const plants = await getUserPlants(session.user.id)

  return (
    <main className="min-h-screen pb-16">
      <DashboardHeader />
      <div className="container px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">ต้นไม้ของฉัน</h1>
        <PlantGrid plants={plants} />
        <AddPlantButton />
      </div>
      <BottomNavigation />
    </main>
  )
}
