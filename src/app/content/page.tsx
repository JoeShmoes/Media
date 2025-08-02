
"use client"

import dynamic from "next/dynamic"

const ContentForm = dynamic(() => import("./_components/content-form").then(mod => mod.ContentForm), { ssr: false })

export default function ContentPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ContentForm />
    </div>
  )
}
