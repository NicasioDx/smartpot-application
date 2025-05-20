import Link from "next/link"
import Image from "next/image"
import type { Plant } from "@/lib/db/plants"
import { Card, CardContent } from "@/components/ui/card"

interface PlantGridProps {
  plants: Plant[]
}

export default function PlantGrid({ plants }: PlantGridProps) {
  if (plants.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">ยังไม่มีต้นไม้ กดปุ่ม + เพื่อเพิ่มต้นไม้</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {plants.map((plant) => (
        <Link key={plant.id} href={`/dashboard/plant/${plant.id}`}>
          <Card className="overflow-hidden h-full transition-transform hover:scale-105">
            <div className="aspect-square relative">
              <Image
                src={plant.imageUrl || "/placeholder.svg?height=300&width=300"}
                alt={plant.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium truncate">{plant.name}</h3>
              {plant.species && <p className="text-sm text-muted-foreground truncate">{plant.species}</p>}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
