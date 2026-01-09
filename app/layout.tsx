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
    default: "MEOW CHAT - AJ KAMESH's Personal AI Assistant",
    template: "%s | MEOW CHAT"
  },
  description:
    "MEOW CHAT - AJ KAMESH's personal multi-model AI chat interface with GPT-4, Claude, Gemini, Grok, and more. Your personal AI assistant powered by AJ STUDIOZ.",
  keywords: [
    "MEOW CHAT", "AJ KAMESH", "AI chat", "personal AI", "ChatGPT", "Claude chat", 
    "Gemini chat", "Grok chat", "AI assistant", "multi-model AI", "AJ STUDIOZ",
    "AI chatbot", "artificial intelligence", "GPT-4", "local AI", "Ollama"
  ],
  authors: [{ name: "AJ KAMESH" }, { name: "AJ STUDIOZ" }],
  creator: "AJ KAMESH",
  publisher: "AJ STUDIOZ",
  metadataBase: new URL("https://www.meowchat.ajstudioz.co.in"),
  alternates: {
    canonical: "https://www.meowchat.ajstudioz.co.in"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.meowchat.ajstudioz.co.in",
    title: "MEOW CHAT - AJ KAMESH's Personal AI Assistant",
    description: "MEOW CHAT - AJ KAMESH's personal AI chat with GPT-4, Claude, Gemini, Grok, and more. Multi-model AI powered by AJ STUDIOZ.",
    siteName: "MEOW CHAT - AJ KAMESH's AI",
    images: [
      {
        url: "https://www.meowchat.ajstudioz.co.in/og-image",
        width: 1200,
        height: 630,
        alt: "MEOW CHAT - AJ KAMESH's Personal AI Assistant",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MEOW CHAT - AJ KAMESH's Personal AI Assistant",
    description: "AJ KAMESH's personal AI chat with GPT-4, Claude, Gemini, Grok, and more. Powered by AJ STUDIOZ.",
    images: ["https://www.meowchat.ajstudioz.co.in/og-image"]
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
  },
  icons: {
    icon: [
      { url: "/AJ.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" }
    ],
    apple: "/AJ.svg",
    shortcut: "/AJ.svg"
  },
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:updated_time': new Date().toISOString(),
    'twitter:image:width': '1200',
    'twitter:image:height': '630'
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
