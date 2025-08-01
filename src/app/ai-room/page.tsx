import dynamic from "next/dynamic"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"

const AiRoomChat = dynamic(() => import("./_components/ai-room-chat").then(mod => mod.AiRoomChat), {
  ssr: false,
  loading: () => (
    <div className="space-y-4">
      <Skeleton className="h-[60vh] w-full" />
    </div>
  ),
})

export default function AiRoomPage() {
  return (
    <div className="flex flex-col h-full flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Crifohay" />
      <p className="text-muted-foreground -mt-4">
        Your personal GPT-4-powered assistant. Ask questions, generate ideas, and get real-time business advice.
      </p>
      <AiRoomChat />
    </div>
  )
}
