"use client"

import { PageHeader } from "@/components/page-header"
import { OutreachForm } from "./_components/outreach-form"

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
