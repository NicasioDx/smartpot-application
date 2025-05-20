import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getUserProfile } from "@/lib/db/users"
import ProfileHeader from "@/components/profile/profile-header"
import ProfileDetails from "@/components/profile/profile-details"
import BottomNavigation from "@/components/layout/bottom-navigation"

export default async function ProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const profile = await getUserProfile(session.user.id)

  return (
    <main className="min-h-screen pb-16">
      <ProfileHeader />
      <div className="container px-4 py-6">
        <ProfileDetails profile={profile} />
      </div>
      <BottomNavigation />
    </main>
  )
}
