
"use client"

import { GmChat } from "./_components/gm-chat"

export default function GmPage() {
  return (
    <div className="flex flex-col h-full flex-1 space-y-4 p-4 md:p-8 pt-6">
      <GmChat />
    </div>
  )
}
