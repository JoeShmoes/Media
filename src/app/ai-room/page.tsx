"use client"

import { PageHeader } from "@/components/page-header"
import dynamic from "next/dynamic"

const AiRoomChat = dynamic(() => import("./_components/ai-room-chat").then(mod => mod.AiRoomChat), { ssr: false })

export default function AiRoomPage() {
  return (
    <div className="flex flex-col h-full flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="AI Room" />
      <p className="text-muted-foreground -mt-4">
        Your personal GPT-4-powered assistant. Ask questions, generate ideas, and get real-time business advice.
      </p>
      <AiRoomChat />
    </div>
  )
}
