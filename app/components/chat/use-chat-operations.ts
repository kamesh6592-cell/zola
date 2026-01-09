import { toast } from "@/components/ui/toast"
import { checkRateLimits } from "@/lib/api"
import type { Chats } from "@/lib/chat-store/types"
import { REMAINING_QUERY_ALERT_THRESHOLD } from "@/lib/config"
import { Message } from "@ai-sdk/react"
import { useCallback } from "react"

type UseChatOperationsProps = {
  isAuthenticated: boolean
  chatId: string | null
  messages: Message[]
  selectedModel: string
  systemPrompt: string
  createNewChat: (
    userId: string,
    title?: string,
    model?: string,
    isAuthenticated?: boolean,
    systemPrompt?: string
  ) => Promise<Chats | undefined>
  setHasDialogAuth: (value: boolean) => void
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
  setInput: (input: string) => void
}

export function useChatOperations({
  isAuthenticated,
  chatId,
  messages,
  selectedModel,
  systemPrompt,
  createNewChat,
  setHasDialogAuth,
  setMessages,
}: UseChatOperationsProps) {
  // Chat utilities
  const checkLimitsAndNotify = async (uid: string): Promise<boolean> => {
    try {
      const rateData = await checkRateLimits(uid, isAuthenticated)

      if (rateData.remaining === 0 && !isAuthenticated) {
        // Show login reminder toast instead of forcing redirect
        toast({
          title: "Daily limit reached!",
          description: "Login to continue chatting with unlimited messages.",
          status: "warning",
          button: {
            label: "Login",
            onClick: () => {
              window.location.href = "/login"
            },
          },
        })
        return false
      }

      // Show login reminder every 5 messages for guests
      if (!isAuthenticated && rateData.count > 0 && rateData.count % 5 === 0) {
        toast({
          title: "💡 Tip: Login for unlimited access",
          description: `You've sent ${rateData.count} messages. Login to get unlimited messages and save your chats!`,
          status: "info",
          button: {
            label: "Login Now",
            onClick: () => {
              window.location.href = "/login"
            },
          },
        })
      }

      if (rateData.remaining === REMAINING_QUERY_ALERT_THRESHOLD && isAuthenticated) {
        toast({
          title: `Only ${rateData.remaining} quer${
            rateData.remaining === 1 ? "y" : "ies"
          } remaining today.`,
          status: "info",
        })
      }

      if (rateData.remainingPro === REMAINING_QUERY_ALERT_THRESHOLD) {
        toast({
          title: `Only ${rateData.remainingPro} pro quer${
            rateData.remainingPro === 1 ? "y" : "ies"
          } remaining today.`,
          status: "info",
        })
      }

      return true
    } catch (err) {
      console.error("Rate limit check failed:", err)
      return true // Allow chat to continue even if rate limit check fails
    }
  }

  const ensureChatExists = async (userId: string, input: string) => {
    if (chatId) return chatId

    if (!isAuthenticated) {
      const storedGuestChatId = localStorage.getItem("guestChatId")
      if (storedGuestChatId) return storedGuestChatId
    }

    try {
      const newChat = await createNewChat(
        userId,
        input,
        selectedModel,
        isAuthenticated,
        systemPrompt
      )

      if (!newChat) return null
      if (isAuthenticated) {
        window.history.pushState(null, "", `/c/${newChat.id}`)
      } else {
        localStorage.setItem("guestChatId", newChat.id)
      }

      return newChat.id
    } catch (err: unknown) {
      let errorMessage = "Something went wrong."
      try {
        const errorObj = err as { message?: string }
        if (errorObj.message) {
          const parsed = JSON.parse(errorObj.message)
          errorMessage = parsed.error || errorMessage
        }
      } catch {
        const errorObj = err as { message?: string }
        errorMessage = errorObj.message || errorMessage
      }
      toast({
        title: errorMessage,
        status: "error",
      })
      return null
    }
  }

  // Message handlers
  const handleDelete = useCallback(
    (id: string) => {
      setMessages(messages.filter((message) => message.id !== id))
    },
    [messages, setMessages]
  )

  const handleEdit = useCallback(
    (id: string, newText: string) => {
      setMessages(
        messages.map((message) =>
          message.id === id ? { ...message, content: newText } : message
        )
      )
    },
    [messages, setMessages]
  )

  return {
    // Utils
    checkLimitsAndNotify,
    ensureChatExists,

    // Handlers
    handleDelete,
    handleEdit,
  }
}
