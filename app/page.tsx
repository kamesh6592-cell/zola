import { ChatContainer } from "@/app/components/chat/chat-container"
import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import Script from "next/script"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "AJ KAMESH AI - Personal Multi-Model AI Chat",
  description: "Chat with GPT-4, Claude, Gemini, Grok and more AI models. AJ KAMESH's personal AI assistant powered by AJ STUDIOZ.",
  keywords: "AJ KAMESH, ai chat, gpt-4, claude, gemini, grok, ai assistant, personal ai, artificial intelligence",
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AJ KAMESH AI - Personal AI Assistant",
    "url": "https://ai.ajkamesh.com",
    "description": "Personal AI chat with multiple models - GPT-4, Claude, Gemini, Grok and more",
    "mainEntity": {
      "@type": "WebApplication",
      "name": "AJ KAMESH AI by AJ STUDIOZ",
      "applicationCategory": "ProductivityApplication",
      "author": {
        "@type": "Person",
        "name": "AJ KAMESH"
      },
      "creator": {
        "@type": "Organization",
        "name": "AJ STUDIOZ"
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
