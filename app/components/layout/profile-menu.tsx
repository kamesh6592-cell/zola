"use client"

import { Menu } from "@openai/apps-sdk-ui/components/Menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useUser } from "@/lib/user-store/provider"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useMessages } from "@/lib/chat-store/messages/provider"
import { clearAllIndexedDBStores } from "@/lib/chat-store/persist"
import { ADMIN_EMAILS } from "@/lib/config"
import { Shield } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SettingsContent } from "./settings/settings-content"

export function ProfileMenu() {
  const { user, signOut } = useUser()
  const { resetChats } = useChats()
  const { resetMessages } = useMessages()
  const router = useRouter()
  const [isSettingsOpen, setSettingsOpen] = useState(false)

  if (!user) return null

  const handleLogout = async () => {
    try {
      await resetMessages()
      await resetChats()
      await signOut()
      await clearAllIndexedDBStores()
      router.push("/")
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  const handleFeedback = () => {
    // You can implement feedback functionality here
    console.log("Feedback")
  }

  const handleHelp = () => {
    // You can implement help functionality here
    console.log("Help")
  }

  return (
    <>
      <Menu>
        {/* Trigger (bottom-left like ChatGPT) */}
        <Menu.Trigger>
          <Button
            variant="ghost"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left justify-start h-auto min-h-12"
          >
            {/* Avatar */}
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user?.profile_image ?? undefined} />
              <AvatarFallback className="text-sm font-semibold bg-primary text-primary-foreground">
                {user?.display_name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>

            {/* Name */}
            <div className="flex flex-col min-w-0 flex-1 text-left leading-tight">
              <p className="text-sm font-medium truncate text-foreground">{user?.display_name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </Button>
        </Menu.Trigger>

        {/* Menu Content */}
        <Menu.Content width={240} minWidth={240}>
          {/* User info */}
          <Menu.Item disabled>
            <div className="flex gap-3 items-center">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={user?.profile_image ?? undefined} />
                <AvatarFallback className="font-semibold">
                  {user?.display_name?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{user?.display_name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  @{user?.email?.split('@')[0]}
                </p>
              </div>
            </div>
          </Menu.Item>

          <Menu.Separator />

          {/* Menu links */}
          <Menu.Item onSelect={() => setSettingsOpen(true)}>
            Settings
          </Menu.Item>

          <Menu.Item onSelect={handleFeedback}>
            Feedback
          </Menu.Item>

          <Menu.Item onSelect={handleHelp}>
            Help
          </Menu.Item>

          {user?.email && ADMIN_EMAILS.includes(user.email) && (
            <>
              <Menu.Separator />
              <Menu.Item onSelect={() => window.open('/admin', '_blank')}>
                <div className="flex items-center gap-2">
                  <Shield className="size-4" />
                  Admin Panel
                </div>
              </Menu.Item>
            </>
          )}

          <Menu.Separator />

          <Menu.Item
            className="text-red-500 hover:text-red-600"
            onSelect={handleLogout}
          >
            Log out
          </Menu.Item>
        </Menu.Content>
      </Menu>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="flex h-[80%] min-h-[480px] w-full flex-col gap-0 p-0 sm:max-w-[768px]">
          <DialogHeader className="border-border border-b px-6 py-5">
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <SettingsContent />
        </DialogContent>
      </Dialog>
    </>
  )
}