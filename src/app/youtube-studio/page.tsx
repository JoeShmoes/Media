"use client"

import dynamic from "next/dynamic"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"

const YoutubeScriptForm = dynamic(() => import("./_components/youtube-script-form").then(mod => mod.YoutubeScriptForm), {
  ssr: false,
  loading: () => (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <Skeleton className="h-[500px] w-full" />
      <Skeleton className="h-[500px] w-full" />
    </div>
  )
})

export default function YouTubeStudioPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Studio" />
      <p className="text-muted-foreground">
        A full creative suite to generate video scripts with titles, hooks, and CTAs.
      </p>
      <YoutubeScriptForm />
    </div>
  )
}
