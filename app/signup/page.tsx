"use client"

import { SignInPage } from "@/components/sign-in"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/toast"

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleGoogleSignUp = async () => {
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
        description: "Failed to sign up with Google",
        status: "error",
      })
    }
  }

  const handleEmailSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          status: "error",
        })
        return
      }

      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account",
        status: "success",
      })
      
      router.push('/login')
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        status: "error",
      })
    }
  }

  const handleBackToLogin = () => {
    router.push('/login')
  }

  return (
    <SignInPage
      title={
        <>
          Join <span className="text-primary">MEOW CHAT</span>
        </>
      }
      description="Create your account and start chatting with multiple AI models"
      heroImageSrc="/cover_zola.jpg"
      testimonials={[
        {
          avatarSrc: "/AJ.svg",
          name: "AJ KAMESH",
          handle: "@ajkamesh",
          text: "Access GPT-4, Claude, Gemini, Grok and more AI models in one place!",
        },
      ]}
      onSignIn={handleEmailSignUp}
      onGoogleSignIn={handleGoogleSignUp}
      onCreateAccount={handleBackToLogin}
    />
  )
}
