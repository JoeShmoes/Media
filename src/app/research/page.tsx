
"use client"

import { ResearchForm } from "./_components/research-form"
import { PageHeader } from "@/components/page-header"

export default function ResearchPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <PageHeader
        title="Research Assistant"
        description="Leverage AI and the web to get comprehensive answers to your questions."
      />
      <ResearchForm />
    </div>
  )
}
