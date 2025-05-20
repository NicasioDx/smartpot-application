import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import RegisterForm from "@/components/auth/register-form"

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">SmartPot</h1>
          <p className="mt-2 text-lg text-muted-foreground">สมัครสมาชิก</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  )
}
