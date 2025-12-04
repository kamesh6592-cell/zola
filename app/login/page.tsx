"use client"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-muted min-h-screen flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-6xl">
        <LoginForm />
      </div>
    </div>
  )
}
