import { ChatContainer } from "@/app/components/chat/chat-container"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import Script from "next/script"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "MEOW CHAT - Free AI Chat with Multiple Models",
  description: "Chat with GPT-4, Claude, Gemini, Grok and more AI models for free. No registration required. Start your AI conversation now!",
  keywords: "meow chat, free ai chat, gpt-4 free, claude free, gemini free, grok free, ai chatbot, artificial intelligence",
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "MEOW CHAT - Free AI Chat Interface",
    "url": "https://www.meowchat.ajstudioz.co.in",
    "description": "Free AI chat with multiple models - GPT-4, Claude, Gemini, Grok and more",
    "mainEntity": {
      "@type": "WebApplication",
      "name": "MEOW CHAT by AJ STUDIOZ",
      "applicationCategory": "ProductivityApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  }

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <MessagesProvider>
        <LayoutApp>
          <ChatContainer />
        </LayoutApp>
      </MessagesProvider>
    </>
  )
}
