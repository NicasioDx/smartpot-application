import Link from "next/link"
import type { UserProfile } from "@/lib/db/users"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil } from "lucide-react"

interface ProfileDetailsProps {
  profile: UserProfile | null
}

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ไม่พบข้อมูลโปรไฟล์</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ข้อมูลส่วนตัว</CardTitle>
        <Link href="/profile/edit">
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            แก้ไข
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">อีเมล</h3>
          <p>{profile.email}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">ชื่อเล่น</h3>
          <p>{profile.nickname || "-"}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground">วันเกิด</h3>
          <p>
            {profile.birthDate
              ? new Date(profile.birthDate).toLocaleDateString("th-TH", {
                  dateStyle: "long",
                })
              : "-"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
