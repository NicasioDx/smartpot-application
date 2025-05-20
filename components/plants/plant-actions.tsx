"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Droplet, Flower } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PlantActionsProps {
  plantId: number
}

export default function PlantActions({ plantId }: PlantActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isWatering, setIsWatering] = useState(false)
  const [isFertilizing, setIsFertilizing] = useState(false)

  const handleWater = async () => {
    setIsWatering(true)

    try {
      const response = await fetch(`/api/plants/${plantId}/water`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการรดน้ำต้นไม้")
      }

      toast({
        title: "รดน้ำเสร็จแล้ว",
        description: "ต้นไม้ของคุณได้รับน้ำแล้ว",
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: (error as Error).message,
      })
    } finally {
      setIsWatering(false)
    }
  }

  const handleFertilize = async () => {
    setIsFertilizing(true)

    try {
      const response = await fetch(`/api/plants/${plantId}/fertilize`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการใส่ปุ๋ยต้นไม้")
      }

      toast({
        title: "ใส่ปุ๋ยเสร็จสิ้น",
        description: "ใส่ปุ๋ยเสร็จสิ้น แล้วกลับมาใส่ใหม่ในครั้งถัดไป!!!",
      })

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: (error as Error).message,
      })
    } finally {
      setIsFertilizing(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <Button onClick={handleWater} disabled={isWatering} className="h-14">
        <Droplet className="mr-2 h-5 w-5" />
        {isWatering ? "กำลังรดน้ำ..." : "รดน้ำ"}
      </Button>

      <Button onClick={handleFertilize} disabled={isFertilizing} variant="secondary" className="h-14">
        <Flower className="mr-2 h-5 w-5" />
        {isFertilizing ? "กำลังใส่ปุ๋ย..." : "ใส่ปุ๋ย"}
      </Button>
    </div>
  )
}
