import dynamic from "next/dynamic"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"

const GmChat = dynamic(() => import("./_components/gm-chat").then(mod => mod.GmChat), {
  ssr: false,
  loading: () => <Skeleton className="h-[60vh] w-full" />
})

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
