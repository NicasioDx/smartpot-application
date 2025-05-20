import Link from "next/link"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-14 items-center px-4">
        <h1 className="text-lg font-semibold">SmartPot</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">โปรไฟล์</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
