import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EditProfileHeader() {
  return (
    <header className="border-b">
      <div className="container flex h-14 items-center px-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">กลับ</span>
          </Button>
        </Link>
        <h1 className="ml-2 text-lg font-semibold">แก้ไขโปรไฟล์</h1>
      </div>
    </header>
  )
}
