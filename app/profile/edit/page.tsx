import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getUserProfile } from "@/lib/db/users"
import EditProfileHeader from "@/components/profile/edit-profile-header"
import EditProfileForm from "@/components/profile/edit-profile-form"
import BottomNavigation from "@/components/layout/bottom-navigation"

export default async function EditProfilePage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const profile = await getUserProfile(session.user.id)

  return (
    <main className="min-h-screen pb-16">
      <EditProfileHeader />
      <div className="container px-4 py-6">
        <EditProfileForm profile={profile} />
      </div>
      <BottomNavigation />
    </main>
  )
}
