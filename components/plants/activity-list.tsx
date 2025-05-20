import type { PlantActivity } from "@/lib/db/activities"
import { Card, CardContent } from "@/components/ui/card"
import { Droplet, Flower } from "lucide-react"

interface ActivityListProps {
  activities: PlantActivity[]
}

export default function ActivityList({ activities }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ยังไม่มีประวัติการดูแล</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardContent className="p-4 flex items-center gap-4">
            {activity.activityType === "watering" ? (
              <Droplet className="h-8 w-8 text-blue-500 shrink-0" />
            ) : (
              <Flower className="h-8 w-8 text-green-500 shrink-0" />
            )}

            <div className="flex-1">
              <h3 className="font-medium">{activity.activityType === "watering" ? "รดน้ำ" : "ใส่ปุ๋ย"}</h3>
              {activity.notes && <p className="text-sm text-muted-foreground">{activity.notes}</p>}
              <p className="text-sm text-muted-foreground">
                {new Date(activity.performedAt).toLocaleString("th-TH", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
