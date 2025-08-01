import dynamic from "next/dynamic"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"

const OutreachForm = dynamic(() => import("./_components/outreach-form").then(mod => mod.OutreachForm), {
  ssr: false,
  loading: () => (
     <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
  )
})

export default function OutreachPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="AI Outreach Engine" />
      <p className="text-muted-foreground">
        Automatically generate high-converting cold DMs, emails, and phone call scripts.
      </p>
      <OutreachForm />
    </div>
  )
}
