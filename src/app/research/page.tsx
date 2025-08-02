"use client"

import { PageHeader } from "@/components/page-header"
import { ResearchForm } from "./_components/research-form"


export default function ResearchPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader 
        title="AI Research Assistant"
        description="Leverage AI and Wikipedia to get comprehensive answers to your questions."
      />
      <ResearchForm />
    </div>
  )
}
