import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ChatsProvider } from "@/lib/chat-store/chats/provider"
import { ChatSessionProvider } from "@/lib/chat-store/session/provider"
import { ModelProvider } from "@/lib/model-store/provider"
import { TanstackQueryProvider } from "@/lib/tanstack-query/tanstack-query-provider"
import { UserPreferencesProvider } from "@/lib/user-preference-store/provider"
import { UserProvider } from "@/lib/user-store/provider"
import { getUserProfile } from "@/lib/user/api"
import { ThemeProvider } from "next-themes"
import Script from "next/script"
import { LayoutClient } from "./layout-client"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "MEOW CHAT by AJ STUDIOZ - Free AI Chat Interface",
    template: "%s | MEOW CHAT by AJ STUDIOZ"
  },
  description:
    "MEOW CHAT by AJ STUDIOZ - Free AI chat interface with multiple models. Chat with GPT-4, Claude, Gemini, Grok and more. Open-source, self-hostable AI chatbot platform.",
  keywords: [
    "meow chat", "AI chat", "free AI chat", "ChatGPT alternative", "Claude chat", 
    "Gemini chat", "Grok chat", "AI chatbot", "open source AI", "AJ STUDIOZ",
    "multi-model AI", "free chatbot", "AI assistant", "artificial intelligence"
  ],
  authors: [{ name: "AJ STUDIOZ" }],
  creator: "AJ STUDIOZ",
  publisher: "AJ STUDIOZ",
  metadataBase: new URL("https://www.meowchat.ajstudioz.co.in"),
  alternates: {
    canonical: "https://www.meowchat.ajstudioz.co.in"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.meowchat.ajstudioz.co.in",
    title: "MEOW CHAT by AJ STUDIOZ - Free AI Chat Interface",
    description: "Free AI chat with multiple models - GPT-4, Claude, Gemini, Grok. Open-source chatbot platform by AJ STUDIOZ.",
    siteName: "MEOW CHAT by AJ STUDIOZ",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MEOW CHAT - Free AI Chat Interface"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MEOW CHAT by AJ STUDIOZ - Free AI Chat Interface",
    description: "Free AI chat with multiple models - GPT-4, Claude, Gemini, Grok. Open-source chatbot platform.",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "d8d5cefb59e24d2d"
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDev = process.env.NODE_ENV === "development"
  const isOfficialDeployment = process.env.ZOLA_OFFICIAL === "true"
  const userProfile = await getUserProfile()

  return (
    <html lang="en" suppressHydrationWarning>
      {isOfficialDeployment ? (
        <Script
          defer
          src="https://assets.onedollarstats.com/stonks.js"
          {...(isDev ? { "data-debug": "zola.chat" } : {})}
        />
      ) : null}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackQueryProvider>
          <LayoutClient />
          <UserProvider initialUser={userProfile}>
            <ModelProvider>
              <ChatsProvider userId={userProfile?.id}>
                <ChatSessionProvider>
                  <UserPreferencesProvider
                    userId={userProfile?.id}
                    initialPreferences={userProfile?.preferences}
                  >
                    <TooltipProvider
                      delayDuration={200}
                      skipDelayDuration={500}
                    >
                      <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                      >
                        <SidebarProvider defaultOpen>
                          <Toaster position="top-center" />
                          {children}
                        </SidebarProvider>
                      </ThemeProvider>
                    </TooltipProvider>
                  </UserPreferencesProvider>
                </ChatSessionProvider>
              </ChatsProvider>
            </ModelProvider>
          </UserProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
