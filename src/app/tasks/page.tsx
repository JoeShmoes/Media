
"use client"

import { TasksBoard } from "./_components/tasks-board";

export default function TasksPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <TasksBoard />
    </div>
  )
}
