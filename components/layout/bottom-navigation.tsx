"use client"

import { useRouter } from "next/navigation"
import { Home, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function BottomNavigation() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการออกจากระบบ")
      }

      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: (error as Error).message,
      })
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <Button variant="ghost" size="icon" className="h-12 w-12" onClick={() => router.push("/dashboard")}>
          <Home className="h-6 w-6" />
          <span className="sr-only">หน้าหลัก</span>
        </Button>

        <Button variant="ghost" size="icon" className="h-12 w-12" onClick={handleLogout}>
          <LogOut className="h-6 w-6" />
          <span className="sr-only">ออกจากระบบ</span>
        </Button>
      </div>
    </div>
  )
}
