"use client"

import { SignInPage } from "@/components/sign-in"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/toast"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not configured. Please check your environment variables.",
        status: "error",
      })
      return
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          status: "error",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        status: "error",
      })
    }
  }

  const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!supabase) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not configured. Please check your environment variables.",
        status: "error",
      })
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          status: "error",
        })
        return
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in to MEOW CHAT",
        status: "success",
      })
      
      router.push('/')
      router.refresh()
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        status: "error",
      })
    }
  }

  const handleResetPassword = () => {
    router.push('/reset-password')
  }

  const handleCreateAccount = () => {
    router.push('/signup')
  }

  return (
    <SignInPage
      title={<span className="font-light text-foreground tracking-tighter">Welcome to MEOW CHAT</span>}
      description="Sign in below to increase your message limits and unlock all features"
      onSignIn={handleEmailSignIn}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
    />
  )
}
