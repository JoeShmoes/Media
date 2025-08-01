import dynamic from "next/dynamic"
import { PageHeader } from "@/components/page-header";
import { Skeleton } from "@/components/ui/skeleton";

const TasksBoard = dynamic(() => import("./_components/tasks-board").then(mod => mod.TasksBoard), {
  ssr: false,
  loading: () => (
     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
  )
})

export default function TasksPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PageHeader title="Tasks" />
      <p className="text-muted-foreground">
        Create and manage your tasks and to-do lists.
      </p>
      <TasksBoard />
    </div>
  )
}
