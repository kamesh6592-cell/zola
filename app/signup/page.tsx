"use client"

import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="bg-muted min-h-screen flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-6xl">
        <SignupForm />
      </div>
    </div>
  )
}
