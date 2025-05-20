import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Plant } from "@/lib/db/plants"

interface PlantHistoryHeaderProps {
  plant: Plant
}

export default function PlantHistoryHeader({ plant }: PlantHistoryHeaderProps) {
  return (
    <header className="border-b">
      <div className="container flex h-14 items-center px-4">
        <Link href={`/dashboard/plant/${plant.id}`}>
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">กลับ</span>
          </Button>
        </Link>
        <h1 className="ml-2 text-lg font-semibold truncate">ประวัติ: {plant.name}</h1>
      </div>
    </header>
  )
}
