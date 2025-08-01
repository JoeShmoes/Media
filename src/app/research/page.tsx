import dynamic from "next/dynamic"
import { PageHeader } from "@/components/page-header"
import { Skeleton } from "@/components/ui/skeleton"

const ResearchForm = dynamic(() => import("./_components/research-form").then(mod => mod.ResearchForm), {
  ssr: false,
  loading: () => (
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
  )
})

export default function ResearchPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="AI Research Assistant" />
      <p className="text-muted-foreground">
        Leverage AI and Wikipedia to get comprehensive answers to your questions.
      </p>
      <ResearchForm />
    </div>
  )
}
