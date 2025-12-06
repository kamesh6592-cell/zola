"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { APP_NAME } from "@/lib/config"
import { Info } from "@phosphor-icons/react"
import Image from "next/image"
import { AppInfoContent } from "./app-info-content"

type AppInfoTriggerProps = {
  trigger?: React.ReactNode
}

export function AppInfoTrigger({ trigger }: AppInfoTriggerProps) {

  const defaultTrigger = (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <Info className="size-4" />
      About {APP_NAME}
    </DropdownMenuItem>
  )

  // Always use desktop dialog for consistent experience

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="[&>button:last-child]:bg-background gap-0 overflow-hidden rounded-3xl p-0 shadow-xs sm:max-w-md [&>button:last-child]:rounded-full [&>button:last-child]:p-1">
        <DialogHeader className="p-0">
          <Image
            src="/banner_ocean.jpg"
            alt={`calm paint generate by ${APP_NAME}`}
            width={400}
            height={128}
            className="h-32 w-full object-cover"
          />
          <DialogTitle className="hidden">{APP_NAME}</DialogTitle>
          <DialogDescription className="hidden">
            Your minimalist AI chat companion
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <AppInfoContent />
        </div>
      </DialogContent>
    </Dialog>
  )
}
