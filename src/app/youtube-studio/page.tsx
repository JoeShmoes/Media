"use client"

import { PageHeader } from "@/components/page-header"
import { YoutubeScriptForm } from "./_components/youtube-script-form"

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
