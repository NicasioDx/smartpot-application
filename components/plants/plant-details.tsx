import Image from "next/image"
import type { Plant } from "@/lib/db/plants"
import type { SensorData } from "@/lib/db/sensor-data"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Droplet, Lightbulb, Leaf } from "lucide-react"

interface PlantDetailsProps {
  plant: Plant
  sensorData: SensorData | null
}

export default function PlantDetails({ plant, sensorData }: PlantDetailsProps) {
  // Default values if no sensor data is available
  const moistureLevel = sensorData?.moistureLevel ?? 50
  const lightLevel = sensorData?.lightLevel ?? 60
  const nitrogenLevel = sensorData?.npkNitrogen ?? 40
  const phosphorusLevel = sensorData?.npkPhosphorus ?? 30
  const potassiumLevel = sensorData?.npkPotassium ?? 20

  return (
    <div className="space-y-6">
      <div className="aspect-square relative rounded-lg overflow-hidden">
        <Image
          src={plant.imageUrl || "/placeholder.svg?height=400&width=400"}
          alt={plant.name}
          fill
          className="object-cover"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold">{plant.name}</h2>
        {plant.species && <p className="text-muted-foreground">{plant.species}</p>}
      </div>

      <div className="grid gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">ความชื้น</h3>
            </div>
            <Progress value={moistureLevel} className="h-2" />
            <p className="text-right text-sm text-muted-foreground mt-1">{moistureLevel.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h3 className="font-medium">แสง</h3>
            </div>
            <Progress value={lightLevel} className="h-2" />
            <p className="text-right text-sm text-muted-foreground mt-1">{lightLevel.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-5 w-5 text-green-500" />
              <h3 className="font-medium">แร่ธาตุในดิน</h3>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>ไนโตรเจน (N)</span>
                  <span>{nitrogenLevel.toFixed(1)}%</span>
                </div>
                <Progress value={nitrogenLevel} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>ฟอสฟอรัส (P)</span>
                  <span>{phosphorusLevel.toFixed(1)}%</span>
                </div>
                <Progress value={phosphorusLevel} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>โพแทสเซียม (K)</span>
                  <span>{potassiumLevel.toFixed(1)}%</span>
                </div>
                <Progress value={potassiumLevel} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
