"use client"

import { PageHeader } from "@/components/page-header"
import { GmChat } from "./_components/gm-chat"

export default function GmPage() {
  return (
    <div className="flex flex-col h-full flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="GM Room" />
      <p className="text-muted-foreground -mt-4">
        Say GM to the community. Your message will be visible to all users.
      </p>
      <GmChat />
    </div>
  )
}
