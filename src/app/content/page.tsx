import { PageHeader } from "@/components/page-header"
import { ContentForm } from "./_components/content-form"

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
