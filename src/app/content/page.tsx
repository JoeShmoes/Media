import dynamic from "next/dynamic"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"

const ContentForm = dynamic(() => import("./_components/content-form").then(mod => mod.ContentForm), {
  ssr: false,
  loading: () => (
     <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
  )
})

export default function ContentPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Content Scheduler" />
       <p className="text-muted-foreground">
        Upload & plan daily Reels/Posts and auto-generate hooks, CTAs, hashtags, and captions.
      </p>
      <ContentForm />
    </div>
  )
}
