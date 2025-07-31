import { PageHeader } from "@/components/page-header";
import { TasksBoard } from "./_components/tasks-board";

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
