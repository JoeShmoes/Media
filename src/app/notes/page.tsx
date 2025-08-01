"use client"
import dynamic from "next/dynamic"
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";

const NotesGrid = dynamic(() => import("./_components/notes-grid").then(mod => mod.NotesGrid), {
  ssr: false,
  loading: () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  )
})

export default function NotesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Notes" />
      <p className="text-muted-foreground">
        Create and manage your notes. They are saved automatically.
      </p>
      <NotesGrid />
    </div>
  )
}
