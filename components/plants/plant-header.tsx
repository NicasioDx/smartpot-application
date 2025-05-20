import Link from "next/link"
import { ChevronLeft, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Plant } from "@/lib/db/plants"

interface PlantHeaderProps {
  plant: Plant
}

export default function PlantHeader({ plant }: PlantHeaderProps) {
  return (
    <header className="border-b">
      <div className="container flex h-14 items-center px-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">กลับ</span>
          </Button>
        </Link>
        <h1 className="ml-2 text-lg font-semibold truncate">{plant.name}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link href={`/dashboard/plant/${plant.id}/history`}>
            <Button variant="ghost" size="icon">
              <History className="h-5 w-5" />
              <span className="sr-only">ประวัติ</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
