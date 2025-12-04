import { isSupabaseEnabled } from "@/lib/supabase/config"
import { notFound } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { HeaderGoBack } from "../components/header-go-back"

export default function LoginPage() {
  if (!isSupabaseEnabled) {
    return notFound()
  }

  return (
    <div className="bg-background flex h-dvh w-full flex-col">
      <HeaderGoBack href="/" />

      <main className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-foreground text-3xl font-medium tracking-tight sm:text-4xl">
              Welcome to AJ CHAT
            </h1>
            <p className="text-muted-foreground mt-3">
              Sign in below to increase your message limits.
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
