import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import LoginForm from "@/components/auth/login-form"

export default async function Home() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">SmartPot</h1>
          <p className="mt-2 text-lg text-muted-foreground">กระถางต้นไม้อัจฉริยะ</p>
          <p className="mt-1 text-sm text-muted-foreground">สำหรับคนที่ต้องการปลูกต้นไม้แต่ไม่ค่อยมีเวลาดูแล</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
