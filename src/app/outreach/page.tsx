
"use client"

import dynamic from "next/dynamic"

const OutreachForm = dynamic(() => import("./_components/outreach-form").then(mod => mod.OutreachForm), { ssr: false })

export default function OutreachPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <OutreachForm />
    </div>
  )
}
